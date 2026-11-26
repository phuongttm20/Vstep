import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BookMarked,
  Check,
  CheckCircle2,
  Eye,
  Headphones,
  Play,
  RotateCcw,
  Search,
  Trophy,
  Volume2,
  XCircle,
} from 'lucide-react';
import {
  VSTEP_TOPICS,
  VSTEP_VOCABULARY,
  type VstepTopic,
  type VstepVocabItem,
} from '../data/vstepVocabData';
import { speakEnglish, stopSpeaking } from '../utils/speech';

interface VstepVocabAndGameModuleProps {
  initialMode: 'vocab' | 'game';
  masteredIds: string[];
  onToggleMastered: (wordId: string) => void;
  onGameComplete: (accuracyPercent: number) => void;
}

type GameModeType = 'en-word' | 'vi-meaning';

interface GameQuestion {
  target: VstepVocabItem;
  options: string[];
  correctOption: string;
}

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildGameQuestions(
  pool: VstepVocabItem[],
  count: number,
  gameType: GameModeType
): GameQuestion[] {
  const selectedTargets = shuffleArray(pool).slice(0, Math.min(count, pool.length));

  return selectedTargets.map((target) => {
    if (gameType === 'en-word') {
      const distractorPool = shuffleArray(
        target.confusables.filter((w) => w.toLowerCase() !== target.word.toLowerCase())
      );
      const fallbackWords = shuffleArray(
        VSTEP_VOCABULARY.filter((v) => v.id !== target.id).map((v) => v.word)
      );
      const distractors: string[] = [];
      for (const w of [...distractorPool, ...fallbackWords]) {
        if (!distractors.includes(w) && w !== target.word && distractors.length < 3) {
          distractors.push(w);
        }
      }
      return {
        target,
        options: shuffleArray([target.word, ...distractors]),
        correctOption: target.word,
      };
    } else {
      const otherMeanings = shuffleArray(
        VSTEP_VOCABULARY.filter((v) => v.id !== target.id).map((v) => v.meaningVi)
      );
      const distractors: string[] = [];
      for (const m of otherMeanings) {
        if (!distractors.includes(m) && m !== target.meaningVi && distractors.length < 3) {
          distractors.push(m);
        }
      }
      return {
        target,
        options: shuffleArray([target.meaningVi, ...distractors]),
        correctOption: target.meaningVi,
      };
    }
  });
}

export const VstepVocabAndGameModule: React.FC<VstepVocabAndGameModuleProps> = ({
  initialMode,
  masteredIds,
  onToggleMastered,
  onGameComplete,
}) => {
  const [subMode, setSubMode] = useState<'vocab' | 'game'>(initialMode);

  useEffect(() => {
    setSubMode(initialMode);
  }, [initialMode]);

  // Vocabulary library state
  const [topicFilter, setTopicFilter] = useState<'all' | VstepTopic>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyUnmastered, setOnlyUnmastered] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.85);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Listening game state
  const [gamePhase, setGamePhase] = useState<'setup' | 'playing' | 'summary'>('setup');
  const [gameTopic, setGameTopic] = useState<'all' | VstepTopic>('all');
  const [gameType, setGameType] = useState<GameModeType>('en-word');
  const [questionCount, setQuestionCount] = useState<number>(8);
  const [gameRate, setGameRate] = useState<number>(0.8);

  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [missedWords, setMissedWords] = useState<VstepVocabItem[]>([]);
  const [isGameSpeaking, setIsGameSpeaking] = useState(false);

  const filteredVocab = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return VSTEP_VOCABULARY.filter((item) => {
      if (topicFilter !== 'all' && item.topic !== topicFilter) return false;
      if (onlyUnmastered && masteredIds.includes(item.id)) return false;
      if (
        q &&
        !item.word.toLowerCase().includes(q) &&
        !item.meaningVi.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [topicFilter, searchQuery, onlyUnmastered, masteredIds]);

  const handleSpeak = useCallback((text: string, id: string, rate: number) => {
    speakEnglish(text, {
      rate,
      onStart: () => setSpeakingId(id),
      onEnd: () => setSpeakingId(null),
      onError: () => setSpeakingId(null),
    });
  }, []);

  const playCurrentGameWord = useCallback(
    (word: string, rateOverride?: number) => {
      speakEnglish(word, {
        rate: rateOverride ?? gameRate,
        onStart: () => setIsGameSpeaking(true),
        onEnd: () => setIsGameSpeaking(false),
        onError: () => setIsGameSpeaking(false),
      });
    },
    [gameRate]
  );

  const startGame = () => {
    const pool =
      gameTopic === 'all'
        ? VSTEP_VOCABULARY
        : VSTEP_VOCABULARY.filter((v) => v.topic === gameTopic);
    const built = buildGameQuestions(pool, questionCount, gameType);
    setQuestions(built);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setShowHint(false);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setMissedWords([]);
    setGamePhase('playing');
    if (built.length > 0) {
      setTimeout(() => {
        playCurrentGameWord(built[0].target.word);
      }, 150);
    }
  };

  const currentQuestion = questions[currentIdx];

  const handleSelectGameOption = useCallback(
    (option: string) => {
      if (!currentQuestion || selectedAnswer !== null) return;
      setSelectedAnswer(option);
      const isCorrect = option === currentQuestion.correctOption;

      if (isCorrect) {
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        setBestStreak((prev) => Math.max(prev, nextStreak));
        setScore((prev) => prev + 10 + (nextStreak > 1 ? 2 : 0));
      } else {
        setStreak(0);
        setMissedWords((prev) => [...prev, currentQuestion.target]);
      }
    },
    [currentQuestion, selectedAnswer, streak]
  );

  const handleNextQuestion = useCallback(() => {
    if (currentIdx + 1 >= questions.length) {
      stopSpeaking();
      const correctCount = questions.length - missedWords.length;
      const accuracy =
        questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
      onGameComplete(accuracy);
      setGamePhase('summary');
    } else {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setSelectedAnswer(null);
      setShowHint(false);
      setTimeout(() => {
        playCurrentGameWord(questions[nextIdx].target.word);
      }, 150);
    }
  }, [currentIdx, questions, missedWords.length, onGameComplete, playCurrentGameWord]);

  // Keyboard shortcuts during active game
  useEffect(() => {
    if (subMode !== 'game' || gamePhase !== 'playing' || !currentQuestion) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();

      if (key === 'r') {
        e.preventDefault();
        playCurrentGameWord(currentQuestion.target.word);
      } else if (['1', '2', '3', '4'].includes(key) && selectedAnswer === null) {
        const idx = Number(key) - 1;
        if (currentQuestion.options[idx]) {
          handleSelectGameOption(currentQuestion.options[idx]);
        }
      } else if ((key === 'enter' || key === ' ') && selectedAnswer !== null) {
        e.preventDefault();
        handleNextQuestion();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    subMode,
    gamePhase,
    currentQuestion,
    selectedAnswer,
    playCurrentGameWord,
    handleSelectGameOption,
    handleNextQuestion,
  ]);

  const gamePoolCount =
    gameTopic === 'all'
      ? VSTEP_VOCABULARY.length
      : VSTEP_VOCABULARY.filter((v) => v.topic === gameTopic).length;

  return (
    <div className="space-y-6">
      {/* Module Header & Sub-mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-semibold text-blue-700 font-mono">
            Phần 03 · Từ vựng cốt lõi B1–B2 &amp; Luyện nghe
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 mt-1">
            Từ vựng căn bản VSTEP &amp; Game luyện nghe
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Ôn 48 từ vựng trọng tâm theo 6 chủ đề VSTEP, sau đó thử thách tai nghe qua trò chơi nghe âm thanh chọn đáp án đúng.
          </p>
        </div>

        <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 self-start lg:self-auto shrink-0">
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              setSubMode('vocab');
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              subMode === 'vocab'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>Kho từ vựng ({VSTEP_VOCABULARY.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSubMode('game')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              subMode === 'game'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>Game nghe chọn đáp án</span>
          </button>
        </div>
      </div>

      {subMode === 'vocab' ? (
        <div className="space-y-5">
          {/* Controls Toolbar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col md:flex-row gap-3 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm từ tiếng Anh hoặc nghĩa tiếng Việt..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
                  <span className="px-2 text-slate-600 font-medium">Tốc độ đọc:</span>
                  <button
                    type="button"
                    onClick={() => setSpeechRate(0.72)}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors whitespace-nowrap ${
                      speechRate < 0.8
                        ? 'bg-white text-slate-950 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    0.75x Chậm
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpeechRate(0.95)}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors whitespace-nowrap ${
                      speechRate >= 0.8
                        ? 'bg-white text-slate-950 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    1.0x Chuẩn
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setOnlyUnmastered((v) => !v)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                    onlyUnmastered
                      ? 'bg-blue-50 border-blue-300 text-blue-800'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {onlyUnmastered ? 'Đang lọc: Chưa thuộc' : 'Hiện tất cả trạng thái'}
                </button>
              </div>
            </div>

            {/* Topic filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTopicFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  topicFilter === 'all'
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tất cả chủ đề ({VSTEP_VOCABULARY.length})
              </button>
              {VSTEP_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setTopicFilter(topic.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    topicFilter === topic.id
                      ? 'bg-blue-700 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {topic.labelVi}
                </button>
              ))}
            </div>
          </div>

          {/* Vocab List */}
          {filteredVocab.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-2">
              <p className="text-base font-semibold text-slate-900">
                Không tìm thấy từ vựng phù hợp
              </p>
              <p className="text-sm text-slate-500">
                Thử xóa từ khóa tìm kiếm hoặc chuyển sang chế độ xem tất cả chủ đề.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVocab.map((item) => {
                const isMastered = masteredIds.includes(item.id);
                const topicLabel =
                  VSTEP_TOPICS.find((t) => t.id === item.topic)?.labelVi ?? item.topic;
                const wordSpeaking = speakingId === `${item.id}-word`;
                const exSpeaking = speakingId === `${item.id}-ex`;

                return (
                  <article
                    key={item.id}
                    className={`bg-white border rounded-xl p-5 flex flex-col justify-between gap-4 transition-colors ${
                      isMastered ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs text-slate-500 flex items-center gap-1.5">
                            <span>{topicLabel}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono">{item.pos}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono text-slate-700">{item.ipa}</span>
                          </div>
                          <h3 className="font-display text-xl font-bold text-slate-950 mt-0.5">
                            {item.word}
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSpeak(item.word, `${item.id}-word`, speechRate)}
                          aria-label={`Nghe phát âm từ ${item.word}`}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                            wordSpeaking
                              ? 'bg-blue-700 text-white border-blue-700'
                              : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>{wordSpeaking ? 'Đang đọc' : 'Nghe từ'}</span>
                        </button>
                      </div>

                      <p className="text-sm sm:text-base font-semibold text-blue-800">
                        {item.meaningVi}
                      </p>

                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs sm:text-sm font-medium text-slate-900">
                            {item.exampleEn}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              handleSpeak(item.exampleEn, `${item.id}-ex`, speechRate)
                            }
                            aria-label={`Nghe câu ví dụ của ${item.word}`}
                            className={`p-1.5 rounded-md border shrink-0 transition-colors ${
                              exSpeaking
                                ? 'bg-blue-700 text-white border-blue-700'
                                : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-600">{item.exampleVi}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onToggleMastered(item.id)}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                          isMastered
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isMastered ? 'Đã thuộc từ này' : 'Đánh dấu đã thuộc'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setGameTopic(item.topic);
                          setSubMode('game');
                          setGamePhase('setup');
                        }}
                        className="text-xs font-medium text-blue-700 hover:underline whitespace-nowrap"
                      >
                        Luyện nghe chủ đề này
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Listening Challenge Game */
        <div className="max-w-3xl mx-auto">
          {gamePhase === 'setup' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950">
                  Thiết lập ván Game luyện nghe VSTEP
                </h2>
                <p className="text-sm text-slate-600">
                  Hệ thống sẽ phát âm từ vựng tiếng Anh, nhiệm vụ của bạn là nghe và chọn đúng đáp án nhanh nhất.
                </p>
              </div>

              {/* Topic */}
              <div className="space-y-2.5">
                <label className="block text-sm font-semibold text-slate-900">
                  1. Chọn chủ đề từ vựng
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGameTopic('all')}
                    className={`px-3.5 py-2.5 text-left text-xs sm:text-sm rounded-lg border transition-colors ${
                      gameTopic === 'all'
                        ? 'bg-blue-50 border-blue-600 text-blue-950 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Tất cả 6 chủ đề VSTEP ({VSTEP_VOCABULARY.length} từ)
                  </button>
                  {VSTEP_TOPICS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setGameTopic(t.id)}
                      className={`px-3.5 py-2.5 text-left text-xs sm:text-sm rounded-lg border transition-colors ${
                        gameTopic === t.id
                          ? 'bg-blue-50 border-blue-600 text-blue-950 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {t.labelVi} (8 từ)
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode */}
              <div className="space-y-2.5">
                <label className="block text-sm font-semibold text-slate-900">
                  2. Chọn chế độ thử thách
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGameType('en-word')}
                    className={`p-4 text-left rounded-xl border transition-colors space-y-1 ${
                      gameType === 'en-word'
                        ? 'bg-blue-50 border-blue-600 text-blue-950'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-sm font-bold">Nghe → Chọn từ tiếng Anh</div>
                    <div className="text-xs text-slate-600">
                      Phân biệt từ bạn nghe được giữa 4 từ có phát âm/chính tả gần giống nhau.
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGameType('vi-meaning')}
                    className={`p-4 text-left rounded-xl border transition-colors space-y-1 ${
                      gameType === 'vi-meaning'
                        ? 'bg-blue-50 border-blue-600 text-blue-950'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-sm font-bold">Nghe → Chọn nghĩa tiếng Việt</div>
                    <div className="text-xs text-slate-600">
                      Luyện phản xạ nghe tiếng Anh và hiểu ngay nghĩa tiếng Việt tương ứng.
                    </div>
                  </button>
                </div>
              </div>

              {/* Question Count & Speed */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">
                    3. Số câu hỏi
                  </label>
                  <div className="flex items-center gap-2">
                    {[8, 12, 20].map((num) => {
                      const disabled = num > gamePoolCount && num !== 8;
                      const effectiveLabel = num > gamePoolCount ? `${gamePoolCount} câu` : `${num} câu`;
                      return (
                        <button
                          key={num}
                          type="button"
                          disabled={disabled}
                          onClick={() => setQuestionCount(num)}
                          className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors tabular-nums ${
                            questionCount === num
                              ? 'bg-blue-700 text-white border-blue-700'
                              : disabled
                              ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {effectiveLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">
                    4. Tốc độ phát âm
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setGameRate(0.75)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                        gameRate < 0.85
                          ? 'bg-blue-700 text-white border-blue-700'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      0.75x Chậm (Mất gốc)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGameRate(0.95)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                        gameRate >= 0.85
                          ? 'bg-blue-700 text-white border-blue-700'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      1.0x Chuẩn
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  Mẹo: Có thể nhấn phím <span className="font-mono font-semibold">R</span> để nghe lại và phím{' '}
                  <span className="font-mono font-semibold">1–4</span> để chọn nhanh.
                </p>
                <button
                  type="button"
                  onClick={startGame}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Bắt đầu luyện nghe</span>
                </button>
              </div>
            </div>
          )}

          {gamePhase === 'playing' && currentQuestion && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
              {/* Top Game Telemetry Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4 text-xs sm:text-sm tabular-nums">
                  <span className="font-semibold text-slate-900">
                    Câu {currentIdx + 1} / {questions.length}
                  </span>
                  <span className="text-slate-300" aria-hidden="true">
                    |
                  </span>
                  <span className="text-slate-600">
                    Điểm: <strong className="text-blue-700">{score}</strong>
                  </span>
                  <span className="text-slate-300" aria-hidden="true">
                    |
                  </span>
                  <span className="text-slate-600">
                    Chuỗi đúng: <strong className="text-emerald-700">{streak}</strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    stopSpeaking();
                    setGamePhase('setup');
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                  Thoát ván này
                </button>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-700 transition-transform duration-300 origin-left"
                  style={{
                    transform: `scaleX(${(currentIdx + (selectedAnswer ? 1 : 0)) / questions.length})`,
                  }}
                />
              </div>

              {/* Audio Stage */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center space-y-4">
                <p className="text-xs font-medium text-slate-600">
                  {gameType === 'en-word'
                    ? 'Nghe phát âm và chọn từ tiếng Anh đúng với âm thanh vừa nghe'
                    : 'Nghe phát âm và chọn nghĩa tiếng Việt đúng của từ đó'}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => playCurrentGameWord(currentQuestion.target.word)}
                    className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-colors ${
                      isGameSpeaking
                        ? 'bg-blue-800 text-white'
                        : 'bg-blue-700 text-white hover:bg-blue-800'
                    }`}
                  >
                    <Volume2 className="w-5 h-5" />
                    <span>{isGameSpeaking ? 'Đang phát âm...' : 'Nghe lại từ (Phím R)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const slowRate = 0.65;
                      playCurrentGameWord(currentQuestion.target.word, slowRate);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-3.5 bg-white border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <span>Nghe chậm hơn</span>
                  </button>
                </div>

                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setShowHint((h) => !h)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Ẩn gợi ý' : 'Xem gợi ý (Loại từ & Phiên âm)'}</span>
                  </button>
                </div>

                {showHint && (
                  <div className="text-xs text-slate-700 bg-white border border-slate-200 rounded-lg py-2 px-4 inline-block font-mono">
                    Loại từ: ({currentQuestion.target.pos}) · Phiên âm: {currentQuestion.target.ipa}
                  </div>
                )}
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((opt, idx) => {
                  const isPicked = selectedAnswer === opt;
                  const isCorrectOpt = opt === currentQuestion.correctOption;
                  let cardClass =
                    'bg-white border-slate-300 text-slate-900 hover:border-blue-600 hover:bg-blue-50/40';

                  if (selectedAnswer !== null) {
                    if (isCorrectOpt) {
                      cardClass =
                        'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold';
                    } else if (isPicked) {
                      cardClass = 'bg-rose-50 border-rose-600 text-rose-950';
                    } else {
                      cardClass = 'bg-slate-50 border-slate-200 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={selectedAnswer !== null}
                      onClick={() => handleSelectGameOption(opt)}
                      className={`p-4 rounded-xl border text-left transition-colors flex items-center justify-between gap-3 min-h-[56px] ${cardClass}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs font-semibold text-slate-500 shrink-0">
                          {idx + 1}.
                        </span>
                        <span
                          className={`text-sm sm:text-base ${
                            gameType === 'en-word' ? 'font-semibold' : 'font-medium'
                          }`}
                        >
                          {opt}
                        </span>
                      </div>

                      {selectedAnswer !== null && isCorrectOpt && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                      )}
                      {selectedAnswer !== null && isPicked && !isCorrectOpt && (
                        <XCircle className="w-5 h-5 text-rose-700 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Post-answer Feedback */}
              {selectedAnswer !== null && (
                <div
                  className={`p-5 rounded-xl border space-y-3 ${
                    selectedAnswer === currentQuestion.correctOption
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-rose-50/70 border-rose-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      {selectedAnswer === currentQuestion.correctOption ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span className="text-emerald-950">Chính xác!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-700" />
                          <span className="text-rose-950">
                            Chưa đúng — Từ vừa đọc là:{' '}
                            <strong className="underline">{currentQuestion.target.word}</strong>
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => playCurrentGameWord(currentQuestion.target.exampleEn)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:underline"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Nghe câu ví dụ</span>
                    </button>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-1 text-sm">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="font-bold text-slate-950 text-base">
                        {currentQuestion.target.word}
                      </span>
                      <span className="font-mono text-xs text-slate-500">
                        ({currentQuestion.target.pos}) {currentQuestion.target.ipa}
                      </span>
                      <span className="text-slate-400" aria-hidden="true">
                        —
                      </span>
                      <span className="font-semibold text-blue-800">
                        {currentQuestion.target.meaningVi}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 pt-1">
                      {currentQuestion.target.exampleEn}{' '}
                      <span className="text-slate-500">({currentQuestion.target.exampleVi})</span>
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      {currentIdx + 1 >= questions.length ? 'Xem kết quả' : 'Câu tiếp theo'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {gamePhase === 'summary' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 font-mono">
                    <Trophy className="w-4 h-4" />
                    <span>Hoàn thành lượt luyện nghe</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-slate-950">
                    Kết quả luyện tập từ vựng VSTEP
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 tabular-nums">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500">Độ chính xác</div>
                  <div className="font-display text-2xl font-bold text-slate-950 mt-1">
                    {questions.length > 0
                      ? Math.round(((questions.length - missedWords.length) / questions.length) * 100)
                      : 0}
                    %
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {questions.length - missedWords.length} / {questions.length} câu đúng
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500">Tổng điểm</div>
                  <div className="font-display text-2xl font-bold text-blue-700 mt-1">{score}</div>
                  <div className="text-xs text-slate-600 mt-0.5">Điểm tích lũy ván này</div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500">Chuỗi đúng dài nhất</div>
                  <div className="font-display text-2xl font-bold text-emerald-700 mt-1">
                    {bestStreak}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">Câu liên tiếp</div>
                </div>
              </div>

              {missedWords.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="font-display text-base font-semibold text-slate-900">
                    Các từ bạn nghe nhầm cần ôn lại ({missedWords.length} từ)
                  </h3>
                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                    {missedWords.map((w) => (
                      <div
                        key={w.id}
                        className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-slate-950">{w.word}</span>
                            <span className="font-mono text-xs text-slate-500">{w.ipa}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 mt-0.5">{w.meaningVi}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => playCurrentGameWord(w.word)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 whitespace-nowrap self-start sm:self-center"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Nghe lại</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-950 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>
                    Xuất sắc! Bạn đã nghe chính xác toàn bộ các từ trong ván này. Hãy thử tốc độ 1.0x Chuẩn hoặc chọn tất cả chủ đề.
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={startGame}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi lại ván mới</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGamePhase('setup')}
                  className="px-5 py-2.5 bg-white border border-slate-300 text-slate-800 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Đổi cài đặt game
                </button>
                <button
                  type="button"
                  onClick={() => setSubMode('vocab')}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Quay lại kho từ vựng
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
