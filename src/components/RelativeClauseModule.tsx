import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  GitMerge,
  Volume2,
  XCircle,
} from 'lucide-react';
import {
  RELATIVE_EXERCISES,
  RELATIVE_PRONOUNS,
  SENTENCE_COMBINE_DEMOS,
  type RelativeExercise,
} from '../data/relativeClausesData';
import { speakEnglish } from '../utils/speech';

interface RelativeClauseModuleProps {
  correctIds: string[];
  onMarkCorrect: (exerciseId: string) => void;
}

export const RelativeClauseModule: React.FC<RelativeClauseModuleProps> = ({
  correctIds,
  onMarkCorrect,
}) => {
  const [tab, setTab] = useState<'learn' | 'builder' | 'practice'>('learn');
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  // Interactive Connector State
  const [activeDemoIndex, setActiveDemoIndex] = useState(0);
  const [builderChoice, setBuilderChoice] = useState<string | null>(null);

  // Quiz state
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [fillInputs, setFillInputs] = useState<Record<string, string>>({});
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});

  const activeDemo = SENTENCE_COMBINE_DEMOS[activeDemoIndex];

  const handlePlayAudio = (text: string) => {
    speakEnglish(text, {
      rate: 0.9,
      onStart: () => setSpeakingText(text),
      onEnd: () => setSpeakingText(null),
      onError: () => setSpeakingText(null),
    });
  };

  const isAnswerCorrect = (ex: RelativeExercise): boolean => {
    if (ex.type === 'choice') {
      return selectedOptions[ex.id] === ex.answer;
    }
    const raw = (fillInputs[ex.id] || '').trim().toLowerCase();
    const valid = (ex.acceptableAnswers ?? [ex.answer]).map((a) => a.toLowerCase());
    return valid.includes(raw);
  };

  const handleSelectChoice = (ex: RelativeExercise, opt: string) => {
    setSelectedOptions((prev) => ({ ...prev, [ex.id]: opt }));
    setCheckedMap((prev) => ({ ...prev, [ex.id]: true }));
    if (opt === ex.answer) {
      onMarkCorrect(ex.id);
    }
  };

  const handleCheckFill = (ex: RelativeExercise) => {
    setCheckedMap((prev) => ({ ...prev, [ex.id]: true }));
    if (isAnswerCorrect(ex)) {
      onMarkCorrect(ex.id);
    }
  };

  const sessionCorrectCount = RELATIVE_EXERCISES.filter(
    (ex) => checkedMap[ex.id] && isAnswerCorrect(ex)
  ).length;
  const sessionAttemptedCount = RELATIVE_EXERCISES.filter((ex) => checkedMap[ex.id]).length;

  return (
    <div className="space-y-6">
      {/* Header & Sub-tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-semibold text-blue-700 font-mono">
            Phần 02 · Nối câu nâng cao điểm đọc &amp; viết
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 mt-1">
            Mệnh đề quan hệ (Relative Clauses)
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Học cách dùng Who, Whom, Which, Whose, That, Where, When, Why để ghép câu đơn giản và xử lý nhanh bài tập trắc nghiệm.
          </p>
        </div>

        <div className="inline-flex flex-wrap items-center p-1 bg-slate-100 rounded-lg border border-slate-200 self-start lg:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setTab('learn')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              tab === 'learn'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Kiến thức cốt lõi</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('builder')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              tab === 'builder'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitMerge className="w-4 h-4" />
            <span>Ghép câu trực quan</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('practice')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              tab === 'practice'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Bài tập ({correctIds.length}/{RELATIVE_EXERCISES.length})</span>
          </button>
        </div>
      </div>

      {tab === 'learn' && (
        <div className="space-y-6">
          {/* Core Concept */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <h2 className="font-display text-xl font-bold text-slate-950">
              1. Mệnh đề quan hệ là gì? (Hiểu trong 30 giây)
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Thay vì nói hai câu rời rạc bị lặp từ:{' '}
              <span className="font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                I have a friend. He speaks English well.
              </span>
              , ta dùng đại từ quan hệ (<strong className="text-blue-700">who</strong>) để nối lại
              thành một câu tự nhiên:{' '}
              <span className="font-mono text-slate-900 bg-blue-50 px-1.5 py-0.5 rounded">
                I have a friend <strong>who</strong> speaks English well.
              </span>{' '}
              (Tôi có một người bạn <em>người mà</em> nói tiếng Anh giỏi).
            </p>
          </section>

          {/* Reference Table */}
          <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="font-display text-xl font-bold text-slate-950">
                2. Bảng 8 Đại từ &amp; Trạng từ quan hệ thường gặp
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Chỉ cần nhìn danh từ đứng trước chỗ trống và thành phần đứng sau chỗ trống để chọn đúng từ.
              </p>
            </div>

            <div className="divide-y divide-slate-200">
              {RELATIVE_PRONOUNS.map((row) => {
                const isSpeaking = speakingText === row.exampleEn;
                return (
                  <div
                    key={row.word}
                    className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start"
                  >
                    <div className="lg:col-span-3 space-y-1">
                      <div className="font-mono text-lg font-bold text-blue-700">{row.word}</div>
                      <div className="text-xs font-semibold text-slate-800">{row.usedFor}</div>
                      <div className="text-xs text-slate-500">{row.role}</div>
                    </div>

                    <div className="lg:col-span-5 space-y-1.5">
                      <p className="text-sm font-semibold text-slate-950">{row.exampleEn}</p>
                      <p className="text-xs text-slate-600">{row.exampleVi}</p>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(row.exampleEn)}
                        className={`mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${
                          isSpeaking
                            ? 'bg-blue-700 text-white border-blue-700'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isSpeaking ? 'Đang đọc...' : 'Nghe ví dụ'}</span>
                      </button>
                    </div>

                    <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-700 leading-relaxed">
                      <span className="font-semibold text-slate-900">Mẹo nhớ: </span>
                      {row.tip}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Defining vs Non-defining + Reduction */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-slate-950">
                3. Quy tắc dấu phẩy (Xác định vs Không xác định)
              </h2>
              <div className="space-y-3 text-sm text-slate-700">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                  <div className="font-semibold text-slate-900">
                    Mệnh đề xác định (Không có dấu phẩy)
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dùng khi danh từ phía trước chưa xác định rõ. Được phép dùng <strong>that</strong> thay cho who/whom/which.
                  </p>
                  <p className="font-mono text-xs text-slate-900 pt-1">
                    The book <strong>that/which</strong> is on the table is mine.
                  </p>
                </div>

                <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-lg space-y-1.5">
                  <div className="font-semibold text-amber-950">
                    Mệnh đề không xác định (Có dấu phẩy)
                  </div>
                  <p className="text-xs text-amber-900/90 leading-relaxed">
                    Khi danh từ đứng trước đã xác định sẵn (Tên riêng: <em>Hanoi, Mr. Nam</em>; có <em>this/that/these/those</em>; hoặc sở hữu <em>my father</em>).{' '}
                    <strong>Tuyệt đối KHÔNG dùng "that" sau dấu phẩy!</strong>
                  </p>
                  <p className="font-mono text-xs text-slate-900 pt-1">
                    My father<strong>, who</strong> is 55 years old<strong>,</strong> works as a doctor.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-slate-950">
                4. Rút gọn mệnh đề quan hệ cơ bản
              </h2>
              <p className="text-xs text-slate-600">
                Khi đi thi VSTEP hay trắc nghiệm, câu hay bỏ đại từ quan hệ và rút gọn động từ theo 2 dạng:
              </p>
              <div className="space-y-3 text-sm">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                  <div className="font-semibold text-blue-800">
                    Chủ động → Bỏ đại từ, chuyển động từ thành V-ing
                  </div>
                  <p className="text-xs text-slate-600">
                    The boy <strong>who is sitting</strong> next to me → The boy{' '}
                    <strong className="text-slate-950">sitting</strong> next to me.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                  <div className="font-semibold text-emerald-800">
                    Bị động → Bỏ đại từ + to be, giữ lại V3/ed
                  </div>
                  <p className="text-xs text-slate-600">
                    The letter <strong>which was written</strong> yesterday → The letter{' '}
                    <strong className="text-slate-950">written</strong> yesterday.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {tab === 'builder' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="font-display text-xl font-bold text-slate-950">
              Thực hành ghép 2 câu đơn thành Mệnh đề quan hệ
            </h2>
            <p className="text-sm text-slate-600">
              Chọn một cặp câu mẫu bên dưới, sau đó thử chọn đại từ quan hệ phù hợp để nối chúng lại.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {SENTENCE_COMBINE_DEMOS.map((demo, idx) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => {
                  setActiveDemoIndex(idx);
                  setBuilderChoice(null);
                }}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                  idx === activeDemoIndex
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {demo.title}
              </button>
            ))}
          </div>

          {/* Step 1: Two simple sentences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="text-xs font-semibold text-slate-500">Câu 1 (Mệnh đề chính)</div>
              <p className="text-base font-semibold text-slate-950">{activeDemo.sentence1}</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="text-xs font-semibold text-slate-500">Câu 2 (Bổ sung thông tin)</div>
              <p className="text-base font-semibold text-slate-950">{activeDemo.sentence2}</p>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-slate-600 flex items-center gap-2">
            <span className="font-semibold text-slate-900">Thành phần trùng lặp:</span>
            <code className="font-mono bg-slate-100 px-2 py-0.5 rounded text-blue-700 font-semibold">
              {activeDemo.repeatedTarget}
            </code>
          </div>

          {/* Step 2: Interactive pronoun picker */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="text-sm font-semibold text-slate-900">
              Chọn đại từ / trạng từ quan hệ đúng để nối 2 câu trên:
            </div>
            <div className="flex flex-wrap gap-2.5">
              {['who', 'which', 'whose', 'where'].map((opt) => {
                const isSelected = builderChoice === opt;
                const isRight = opt === activeDemo.pronoun;
                let style = 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50';
                if (builderChoice) {
                  if (isRight) {
                    style = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold';
                  } else if (isSelected) {
                    style = 'bg-rose-50 border-rose-600 text-rose-950';
                  }
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setBuilderChoice(opt)}
                    className={`px-4 py-2 font-mono text-sm rounded-lg border transition-colors ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Result */}
          {builderChoice && (
            <div className="p-5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                {builderChoice === activeDemo.pronoun ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Chính xác! Câu sau khi ghép:</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-rose-800">
                    <XCircle className="w-4 h-4 text-rose-700" />
                    <span>
                      Chưa đúng, từ nối đúng phải là{' '}
                      <strong className="font-mono">{activeDemo.pronoun}</strong>. Câu hoàn chỉnh:
                    </span>
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-blue-200 rounded-lg p-4">
                <div>
                  <p className="text-base sm:text-lg font-bold text-slate-950">
                    {activeDemo.combinedSentence}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {activeDemo.translationVi}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePlayAudio(activeDemo.combinedSentence)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-700 text-white text-xs font-semibold rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe câu ghép</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>{activeDemo.stepExplanation}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {tab === 'practice' && (
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-slate-700 tabular-nums">
              Kết quả lượt làm này:{' '}
              <strong className="text-slate-950">
                {sessionCorrectCount}/{sessionAttemptedCount}
              </strong>{' '}
              câu đúng
            </div>
            {sessionAttemptedCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedOptions({});
                  setFillInputs({});
                  setCheckedMap({});
                }}
                className="text-xs font-semibold text-blue-700 hover:underline"
              >
                Làm lại từ đầu
              </button>
            )}
          </div>

          <div className="space-y-4">
            {RELATIVE_EXERCISES.map((ex, idx) => {
              const checked = !!checkedMap[ex.id];
              const correct = checked && isAnswerCorrect(ex);

              return (
                <div
                  key={ex.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Câu {idx + 1} · {ex.type === 'choice' ? 'Trắc nghiệm' : 'Điền đại từ quan hệ'}
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {ex.options.map((opt, oIdx) => {
                        const isPicked = selectedOptions[ex.id] === opt;
                        const isRight = opt === ex.answer;
                        let style =
                          'bg-white border-slate-200 text-slate-800 hover:border-slate-400 hover:bg-slate-50';
                        if (checked) {
                          if (isRight) {
                            style = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold';
                          } else if (isPicked) {
                            style = 'bg-rose-50 border-rose-600 text-rose-950';
                          } else {
                            style = 'bg-slate-50 border-slate-200 text-slate-500';
                          }
                        }

                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSelectChoice(ex, opt)}
                            className={`px-3.5 py-2.5 rounded-lg border text-sm transition-colors flex items-center justify-between gap-2 min-h-[44px] ${style}`}
                          >
                            <span>
                              <span className="font-mono text-xs text-slate-500 mr-1.5">
                                {String.fromCharCode(65 + oIdx)}.
                              </span>
                              {opt}
                            </span>
                            {checked && isRight && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                            )}
                            {checked && isPicked && !isRight && (
                              <XCircle className="w-4 h-4 text-rose-700 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {ex.hint && <p className="text-xs text-slate-500">Gợi ý: {ex.hint}</p>}
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
                          placeholder="Nhập who / which / whose / where..."
                          className="flex-1 px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleCheckFill(ex)}
                          className="px-4 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0"
                        >
                          Kiểm tra
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
                              Chưa đúng — Đáp án đúng:{' '}
                              <strong className="font-mono underline">{ex.answer}</strong>
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
