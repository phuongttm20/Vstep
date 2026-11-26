import React from 'react';
import { ArrowRight, BookOpen, GitMerge, Headphones, RotateCcw } from 'lucide-react';
import type { AppSection } from './Header';

export interface LearningProgress {
  tenseCorrectIds: string[];
  relativeCorrectIds: string[];
  masteredVocabIds: string[];
  bestGameAccuracy: number | null;
  gamesPlayed: number;
}

interface OverviewSectionProps {
  progress: LearningProgress;
  totalTenseExercises: number;
  totalRelativeExercises: number;
  totalVocabCount: number;
  onNavigate: (section: AppSection) => void;
  onResetProgress: () => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  progress,
  totalTenseExercises,
  totalRelativeExercises,
  totalVocabCount,
  onNavigate,
  onResetProgress,
}) => {
  const modules: {
    number: string;
    title: string;
    subtitle: string;
    meta: string;
    highlights: string[];
    actionLabel: string;
    target: AppSection;
    icon: React.ReactNode;
  }[] = [
    {
      number: 'Phần 01',
      title: 'Các thì tiếng Anh (Tense)',
      subtitle: 'Làm chủ 6 thì cốt lõi nhất cho người mất gốc',
      meta: '6 chuyên đề thì · Trục thời gian trực quan · 24 câu bài tập',
      highlights: [
        'Hiện tại đơn & Hiện tại tiếp diễn',
        'Quá khứ đơn & Quá khứ tiếp diễn',
        'Tương lai đơn (will) & Tương lai gần (be going to)',
      ],
      actionLabel: 'Học 6 thì ngay',
      target: 'tenses',
      icon: <BookOpen className="w-5 h-5 text-blue-700" />,
    },
    {
      number: 'Phần 02',
      title: 'Mệnh đề quan hệ (Relative Clauses)',
      subtitle: 'Hiểu bản chất cách nối câu và tránh bẫy trắc nghiệm',
      meta: '8 đại từ & trạng từ · Ghép câu từng bước · 12 câu bài tập',
      highlights: [
        'Phân biệt Who, Whom, Which, Whose, That',
        'Trạng từ Where, When, Why & quy tắc dấu phẩy',
        'Rút gọn mệnh đề quan hệ cơ bản (V-ing / V3-ed)',
      ],
      actionLabel: 'Học mệnh đề quan hệ',
      target: 'relative',
      icon: <GitMerge className="w-5 h-5 text-blue-700" />,
    },
    {
      number: 'Phần 03',
      title: 'Từ vựng VSTEP & Game luyện nghe',
      subtitle: 'Ghi nhớ từ vựng nền tảng B1–B2 và phản xạ nghe chọn đáp án',
      meta: '48 từ vựng 6 chủ đề · Phát âm chuẩn · Game nghe phản xạ',
      highlights: [
        'Từ vựng chia theo 6 chủ đề quen thuộc của VSTEP',
        'Phiên âm IPA, ví dụ song ngữ, tốc độ đọc chậm 0.75x',
        'Game nghe tiếng Anh chọn từ hoặc nghĩa tiếng Việt',
      ],
      actionLabel: 'Mở kho từ vựng & Game',
      target: 'vstep-vocab',
      icon: <Headphones className="w-5 h-5 text-blue-700" />,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10">
        <div className="max-w-3xl space-y-5">
          <div className="text-xs font-medium text-slate-500 flex flex-wrap items-center gap-2">
            <span>Lộ trình lấy lại căn bản tiếng Anh</span>
            <span aria-hidden="true">·</span>
            <span>Giải thích tiếng Việt dễ hiểu</span>
            <span aria-hidden="true">·</span>
            <span>Thực hành tương tác</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-slate-950 leading-[1.15]">
            Học lại ngữ pháp từ con số 0 và luyện nghe từ vựng VSTEP hiệu quả
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Hệ thống kiến thức cô đọng dành riêng cho người mất gốc: đi từ 6 thì nền tảng,
            cách nối câu bằng mệnh đề quan hệ cho tới kho từ vựng VSTEP kèm game luyện nghe phản xạ.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('tenses')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Bắt đầu từ Phần 1: Các thì</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('vstep-game')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-800 border border-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
            >
              <Headphones className="w-4 h-4 text-blue-700" />
              <span>Chơi game nghe VSTEP</span>
            </button>
          </div>
        </div>
      </section>

      {/* Progress Strip */}
      <section aria-label="Tiến độ học tập của bạn">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-semibold text-slate-900">
            Tiến độ luyện tập hiện tại
          </h2>
          <button
            type="button"
            onClick={onResetProgress}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại tiến độ</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs font-medium text-slate-500">Bài tập 6 thì</div>
            <div className="mt-2 flex items-baseline gap-1.5 tabular-nums">
              <span className="font-display text-2xl font-bold text-slate-950">
                {progress.tenseCorrectIds.length}
              </span>
              <span className="text-sm text-slate-500">/ {totalTenseExercises} câu đúng</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs font-medium text-slate-500">Mệnh đề quan hệ</div>
            <div className="mt-2 flex items-baseline gap-1.5 tabular-nums">
              <span className="font-display text-2xl font-bold text-slate-950">
                {progress.relativeCorrectIds.length}
              </span>
              <span className="text-sm text-slate-500">/ {totalRelativeExercises} câu đúng</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs font-medium text-slate-500">Từ vựng VSTEP đã thuộc</div>
            <div className="mt-2 flex items-baseline gap-1.5 tabular-nums">
              <span className="font-display text-2xl font-bold text-slate-950">
                {progress.masteredVocabIds.length}
              </span>
              <span className="text-sm text-slate-500">/ {totalVocabCount} từ</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs font-medium text-slate-500">Kỷ lục Game nghe</div>
            <div className="mt-2 flex items-baseline gap-1.5 tabular-nums">
              <span className="font-display text-2xl font-bold text-slate-950">
                {progress.bestGameAccuracy !== null ? `${progress.bestGameAccuracy}%` : '—'}
              </span>
              <span className="text-sm text-slate-500">
                {progress.gamesPlayed > 0 ? `${progress.gamesPlayed} lượt chơi` : 'Chưa chơi'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Curriculum Pillars */}
      <section aria-label="Nội dung lộ trình học">
        <div className="mb-4">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            3 nội dung trọng tâm trong lộ trình
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Chọn từng phần để xem bài giảng chi tiết, ví dụ có âm thanh và làm bài tập chấm điểm ngay.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {modules.map((mod) => (
            <article
              key={mod.number}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-700 font-mono">
                    {mod.number}
                  </span>
                  {mod.icon}
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-slate-950">{mod.title}</h3>
                  <p className="text-sm text-slate-600 mt-1.5">{mod.subtitle}</p>
                </div>

                <div className="text-xs text-slate-500 pt-1 border-t border-slate-100">
                  {mod.meta}
                </div>

                <ul className="space-y-2 text-sm text-slate-700">
                  {mod.highlights.map((hl) => (
                    <li key={hl} className="flex items-start gap-2">
                      <span className="text-blue-700 font-semibold select-none" aria-hidden="true">
                        —
                      </span>
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(mod.target)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                <span>{mod.actionLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
