import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Volume2,
  XCircle,
} from 'lucide-react';
import {
  TENSE_EXERCISES,
  TENSE_LESSONS,
  type TenseExercise,
  type TenseId,
  type TenseLesson,
} from '../data/tensesData';
import { speakEnglish } from '../utils/speech';

interface TenseModuleProps {
  correctIds: string[];
  onMarkCorrect: (exerciseId: string) => void;
}

const TenseTimeline: React.FC<{ lesson: TenseLesson }> = ({ lesson }) => {
  const pos = lesson.timelinePosition;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <span className="text-xs font-semibold text-slate-700">
          Trục thời gian minh họa: {lesson.nameVi}
        </span>
        <span className="text-xs text-slate-500">{lesson.timelineCaption}</span>
      </div>

      <div className="relative pt-7 pb-6 px-4">
        {/* Main horizontal axis */}
        <div className="h-0.5 bg-slate-300 w-full relative">
          {/* Past / Now / Future axis markers */}
          <div className="absolute left-[16%] -top-1.5 w-0.5 h-3.5 bg-slate-400" />
          <div className="absolute left-1/2 -top-2 w-0.5 h-4 bg-slate-900" />
          <div className="absolute left-[84%] -top-1.5 w-0.5 h-3.5 bg-slate-400" />

          {/* Past Simple: single closed dot in the past */}
          {pos === 'past' && (
            <div
              className="absolute left-[22%] -top-2.5 w-5 h-5 rounded-full bg-blue-700 border-2 border-white shadow-sm"
              title="Hành động đã chấm dứt trong quá khứ"
            />
          )}

          {/* Past Continuous: span bar in the past */}
          {pos === 'past-span' && (
            <>
              <div className="absolute left-[12%] w-[24%] -top-1.5 h-3 rounded-full bg-blue-600/25 border border-blue-700" />
              <div
                className="absolute left-[24%] -top-2 w-4 h-4 rounded-full bg-amber-600 border-2 border-white"
                title="Thời điểm xác định / hành động xen vào"
              />
            </>
          )}

          {/* Present Simple: repeated ticks across Past -> Now -> Future */}
          {pos === 'present-habit' && (
            <div className="absolute left-[22%] right-[22%] -top-2 flex items-center justify-between">
              {[0, 1, 2, 3, 4].map((idx) => (
                <span
                  key={idx}
                  className="w-3.5 h-3.5 rounded-full bg-blue-700 border-2 border-white shadow-sm"
                />
              ))}
            </div>
          )}

          {/* Present Continuous: active point right on NOW */}
          {pos === 'present-now' && (
            <>
              <div className="absolute left-[43%] w-[14%] -top-1.5 h-3 rounded-full bg-blue-600/25 border border-blue-700" />
              <div className="absolute left-1/2 -translate-x-1/2 -top-2.5 w-5 h-5 rounded-full bg-blue-700 border-2 border-white shadow-sm" />
            </>
          )}

          {/* Future Simple: arrow starting from NOW toward Future */}
          {pos === 'future-instant' && (
            <>
              <div className="absolute left-1/2 w-[26%] -top-0.5 h-1 bg-blue-700" />
              <div className="absolute left-[76%] -top-2 w-4 h-4 rounded-full bg-blue-700 border-2 border-white shadow-sm" />
            </>
          )}

          {/* Near Future: bridge anchored at NOW + planned point in Future */}
          {pos === 'future-plan' && (
            <>
              <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-4 h-4 rounded-full bg-slate-800 border-2 border-white" />
              <div className="absolute left-1/2 w-[24%] -top-1 h-2 rounded-full bg-blue-600/30 border border-blue-700" />
              <div className="absolute left-[74%] -top-2.5 w-5 h-5 rounded-full bg-blue-700 border-2 border-white shadow-sm" />
            </>
          )}
        </div>

        {/* Axis Labels */}
        <div className="mt-4 flex justify-between text-xs font-medium text-slate-600 px-2">
          <span>Quá khứ (Past)</span>
          <span className="font-semibold text-slate-950">Hiện tại (Now)</span>
          <span>Tương lai (Future)</span>
        </div>
      </div>
    </div>
  );
};

export const TenseModule: React.FC<TenseModuleProps> = ({ correctIds, onMarkCorrect }) => {
  const [mode, setMode] = useState<'learn' | 'practice'>('learn');
  const [selectedTenseId, setSelectedTenseId] = useState<TenseId>('present-simple');
  const [exerciseFilter, setExerciseFilter] = useState<'all' | TenseId>('all');
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  // Exercise state
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [fillInputs, setFillInputs] = useState<Record<string, string>>({});
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});

  const activeLesson = useMemo(
    () => TENSE_LESSONS.find((t) => t.id === selectedTenseId) ?? TENSE_LESSONS[0],
    [selectedTenseId]
  );

  const filteredExercises = useMemo(() => {
    if (exerciseFilter === 'all') return TENSE_EXERCISES;
    return TENSE_EXERCISES.filter((ex) => ex.tenseId === exerciseFilter);
  }, [exerciseFilter]);

  const handlePlayAudio = (text: string) => {
    speakEnglish(text, {
      rate: 0.9,
      onStart: () => setSpeakingText(text),
      onEnd: () => setSpeakingText(null),
      onError: () => setSpeakingText(null),
    });
  };

  const isAnswerCorrect = (ex: TenseExercise): boolean => {
    if (ex.type === 'choice') {
      return selectedOptions[ex.id] === ex.answer;
    }
    const raw = (fillInputs[ex.id] || '').trim().toLowerCase().replace(/\s+/g, ' ');
    const valid = (ex.acceptableAnswers ?? [ex.answer]).map((a) => a.toLowerCase());
    return valid.includes(raw);
  };

  const handleSelectChoice = (ex: TenseExercise, option: string) => {
    setSelectedOptions((prev) => ({ ...prev, [ex.id]: option }));
    setCheckedMap((prev) => ({ ...prev, [ex.id]: true }));
    if (option === ex.answer) {
      onMarkCorrect(ex.id);
    }
  };

  const handleCheckFill = (ex: TenseExercise) => {
    setCheckedMap((prev) => ({ ...prev, [ex.id]: true }));
    if (isAnswerCorrect(ex)) {
      onMarkCorrect(ex.id);
    }
  };

  const handleResetQuiz = () => {
    setSelectedOptions({});
    setFillInputs({});
    setCheckedMap({});
  };

  const sessionCorrectCount = filteredExercises.filter(
    (ex) => checkedMap[ex.id] && isAnswerCorrect(ex)
  ).length;
  const sessionAttemptedCount = filteredExercises.filter((ex) => checkedMap[ex.id]).length;

  return (
    <div className="space-y-6">
      {/* Module Header & Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-semibold text-blue-700 font-mono">Phần 01 · Ngữ pháp nền tảng</div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 mt-1">
            6 Thì tiếng Anh cơ bản (Tense)
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Nắm vững công thức, dấu hiệu nhận biết và các lỗi người mất gốc hay gặp, sau đó làm bài tập có giải thích chi tiết.
          </p>
        </div>

        <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setMode('learn')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              mode === 'learn'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Kiến thức 6 thì</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('practice')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              mode === 'practice'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Bài tập thực hành ({correctIds.length}/{TENSE_EXERCISES.length})</span>
          </button>
        </div>
      </div>

      {mode === 'learn' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Selector List */}
          <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-3 space-y-1.5">
            <div className="px-3 py-2 text-xs font-semibold text-slate-500">
              Chọn thì để học chi tiết
            </div>
            {TENSE_LESSONS.map((lesson) => {
              const active = lesson.id === activeLesson.id;
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => setSelectedTenseId(lesson.id)}
                  className={`w-full text-left px-3.5 py-3 rounded-lg transition-colors flex items-start gap-3 ${
                    active
                      ? 'bg-blue-50 text-blue-950 border border-blue-200'
                      : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                  }`}
                >
                  <span
                    className={`font-mono text-xs font-semibold mt-0.5 ${
                      active ? 'text-blue-700' : 'text-slate-400'
                    }`}
                  >
                    {lesson.order}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {lesson.nameVi}
                    </div>
                    <div className="text-xs text-slate-500 truncate">{lesson.nameEn}</div>
                  </div>
                </button>
              );
            })}

            <div className="pt-3 mt-2 border-t border-slate-100 px-2 pb-1">
              <button
                type="button"
                onClick={() => {
                  setExerciseFilter(activeLesson.id);
                  setMode('practice');
                }}
                className="w-full py-2.5 px-4 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                Làm bài tập {activeLesson.nameVi}
              </button>
            </div>
          </aside>

          {/* Right Detailed Lesson Stage */}
          <div className="lg:col-span-8 space-y-6">
            <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
              {/* Lesson Title */}
              <div className="space-y-2 border-b border-slate-100 pb-5">
                <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
                  <span className="font-mono text-blue-700 font-semibold">
                    Chuyên đề {activeLesson.order}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeLesson.nameEn}</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-slate-950">
                  {activeLesson.nameVi}
                </h2>
                <p className="text-sm sm:text-base text-slate-600">{activeLesson.shortSummary}</p>
              </div>

              {/* Interactive Timeline */}
              <TenseTimeline lesson={activeLesson} />

              {/* Formulas */}
              <section className="space-y-3">
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  1. Công thức cần nhớ
                </h3>
                <div className="space-y-4">
                  {activeLesson.formulas.map((f) => (
                    <div
                      key={f.label}
                      className="border border-slate-200 rounded-xl overflow-hidden"
                    >
                      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 text-xs font-semibold text-slate-800">
                        {f.label}
                      </div>
                      <div className="divide-y divide-slate-100 text-sm">
                        <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                          <span className="w-28 shrink-0 text-xs font-semibold text-emerald-700">
                            (+) Khẳng định
                          </span>
                          <code className="font-mono text-xs sm:text-sm text-slate-900 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                            {f.affirmative}
                          </code>
                        </div>
                        <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                          <span className="w-28 shrink-0 text-xs font-semibold text-rose-700">
                            (-) Phủ định
                          </span>
                          <code className="font-mono text-xs sm:text-sm text-slate-900 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                            {f.negative}
                          </code>
                        </div>
                        <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                          <span className="w-28 shrink-0 text-xs font-semibold text-blue-700">
                            (?) Nghi vấn
                          </span>
                          <code className="font-mono text-xs sm:text-sm text-slate-900 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                            {f.question}
                          </code>
                        </div>
                      </div>
                      {f.note && (
                        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
                          <span className="font-semibold text-slate-800">Lưu ý: </span>
                          {f.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Usages & Signals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <section className="space-y-3">
                  <h3 className="font-display text-lg font-semibold text-slate-900">
                    2. Cách dùng cốt lõi
                  </h3>
                  <ul className="space-y-2.5 text-sm text-slate-700 leading-relaxed">
                    {activeLesson.usages.map((u) => (
                      <li key={u} className="flex items-start gap-2">
                        <span className="text-blue-700 font-bold select-none" aria-hidden="true">
                          —
                        </span>
                        <span>{u}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="font-display text-lg font-semibold text-slate-900">
                    3. Dấu hiệu nhận biết
                  </h3>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-xs text-slate-500 mb-2.5">
                      Khi thấy các từ/cụm từ sau trong câu, hãy nghĩ ngay tới {activeLesson.nameVi}:
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm font-medium text-slate-800">
                      {activeLesson.signals.map((sig, idx) => (
                        <React.Fragment key={sig}>
                          <span className="font-mono text-[13px] text-slate-900">{sig}</span>
                          {idx < activeLesson.signals.length - 1 && (
                            <span className="text-slate-400" aria-hidden="true">
                              ·
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              {/* Beginner Traps */}
              <section className="bg-amber-50/60 border border-amber-200 rounded-xl p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Lỗi người mất gốc hay gặp &amp; Mẹo tránh sai</span>
                </div>
                <ul className="space-y-1.5 text-sm text-amber-950/90">
                  {activeLesson.beginnerTips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold" aria-hidden="true">
                        •
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Examples with Audio */}
              <section className="space-y-3">
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  4. Ví dụ minh họa (Bấm nghe phát âm)
                </h3>
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                  {activeLesson.examples.map((ex) => {
                    const isSpeaking = speakingText === ex.en;
                    return (
                      <div
                        key={ex.en}
                        className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <p className="text-sm sm:text-base font-semibold text-slate-950">
                            {ex.en}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-600">{ex.vi}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(ex.en)}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 self-start sm:self-center ${
                            isSpeaking
                              ? 'bg-blue-700 text-white border-blue-700'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{isSpeaking ? 'Đang đọc...' : 'Nghe câu'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            </article>
          </div>
        </div>
      ) : (
        /* Practice Exercise View */
        <div className="space-y-6">
          {/* Filter Bar & Score Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setExerciseFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  exerciseFilter === 'all'
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tổng hợp 6 thì ({TENSE_EXERCISES.length})
              </button>
              {TENSE_LESSONS.map((lesson) => (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => setExerciseFilter(lesson.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    exerciseFilter === lesson.id
                      ? 'bg-blue-700 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lesson.nameVi.replace('Thì ', '')}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs sm:text-sm shrink-0">
              <span className="text-slate-600 tabular-nums">
                Kết quả lượt này:{' '}
                <strong className="text-slate-950">
                  {sessionCorrectCount}/{sessionAttemptedCount}
                </strong>{' '}
                câu đúng
              </span>
              {sessionAttemptedCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="text-xs font-semibold text-blue-700 hover:underline whitespace-nowrap shrink-0"
                >
                  Làm lại bài
                </button>
              )}
            </div>
          </div>

          {/* Exercise Cards */}
          <div className="space-y-4">
            {filteredExercises.map((ex, idx) => {
              const checked = !!checkedMap[ex.id];
              const correct = checked && isAnswerCorrect(ex);
              const tenseMeta = TENSE_LESSONS.find((t) => t.id === ex.tenseId);

              return (
                <div
                  key={ex.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <span>
                      Câu {idx + 1} · {ex.type === 'choice' ? 'Trắc nghiệm' : 'Chia động từ'} ·{' '}
                      {tenseMeta?.nameVi}
                    </span>
                    {correctIds.includes(ex.id) && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đã hoàn thành đúng</span>
                      </span>
                    )}
                  </div>

                  <p className="text-base sm:text-lg font-semibold text-slate-950 leading-relaxed">
                    {ex.question}
                  </p>

                  {ex.type === 'choice' && ex.options ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {ex.options.map((opt, oIdx) => {
                        const isPicked = selectedOptions[ex.id] === opt;
                        const isCorrectOpt = opt === ex.answer;
                        let btnStyle =
                          'bg-white border-slate-200 text-slate-800 hover:border-slate-400 hover:bg-slate-50';

                        if (checked) {
                          if (isCorrectOpt) {
                            btnStyle = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold';
                          } else if (isPicked && !isCorrectOpt) {
                            btnStyle = 'bg-rose-50 border-rose-600 text-rose-950';
                          } else {
                            btnStyle = 'bg-slate-50 border-slate-200 text-slate-500';
                          }
                        }

                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSelectChoice(ex, opt)}
                            className={`text-left px-4 py-3 rounded-lg border text-sm transition-colors flex items-center justify-between gap-2 min-h-[44px] ${btnStyle}`}
                          >
                            <span>
                              <span className="font-mono text-xs text-slate-500 mr-2">
                                {String.fromCharCode(65 + oIdx)}.
                              </span>
                              {opt}
                            </span>
                            {checked && isCorrectOpt && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                            )}
                            {checked && isPicked && !isCorrectOpt && (
                              <XCircle className="w-4 h-4 text-rose-700 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {ex.hint && (
                        <p className="text-xs text-slate-500">Gợi ý: {ex.hint}</p>
                      )}
                      <div className="flex flex-col sm:flex-row gap-2.5">
                        <input
                          type="text"
                          value={fillInputs[ex.id] || ''}
                          onChange={(e) =>
                            setFillInputs((prev) => ({ ...prev, [ex.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCheckFill(ex);
                          }}
                          placeholder="Nhập dạng đúng của động từ..."
                          className="flex-1 px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleCheckFill(ex)}
                          className="px-4 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0"
                        >
                          Kiểm tra đáp án
                        </button>
                      </div>
                    </div>
                  )}

                  {checked && (
                    <div
                      className={`p-4 rounded-lg border text-sm space-y-1 ${
                        correct
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : 'bg-rose-50/70 border-rose-200 text-rose-950'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-semibold">
                        {correct ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                            <span>Chính xác!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-700 shrink-0" />
                            <span>
                              Chưa đúng — Đáp án đúng là:{' '}
                              <span className="font-mono underline">{ex.answer}</span>
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-slate-700 leading-relaxed">{ex.explanationVi}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
