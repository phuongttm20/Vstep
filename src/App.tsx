import { useEffect, useState } from 'react';
import { Header, type AppSection } from './components/Header';
import { OverviewSection, type LearningProgress } from './components/OverviewSection';
import { RelativeClauseModule } from './components/RelativeClauseModule';
import { TenseModule } from './components/TenseModule';
import { VstepVocabAndGameModule } from './components/VstepVocabAndGameModule';
import { RELATIVE_EXERCISES } from './data/relativeClausesData';
import { TENSE_EXERCISES } from './data/tensesData';
import { VSTEP_VOCABULARY } from './data/vstepVocabData';
import { stopSpeaking } from './utils/speech';

const STORAGE_KEY = 'english_foundation_vstep_progress_v1';

const DEFAULT_PROGRESS: LearningProgress = {
  tenseCorrectIds: [],
  relativeCorrectIds: [],
  masteredVocabIds: [],
  bestGameAccuracy: null,
  gamesPlayed: 0,
};

function loadProgress(): LearningProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<LearningProgress>;
    return {
      tenseCorrectIds: Array.isArray(parsed.tenseCorrectIds) ? parsed.tenseCorrectIds : [],
      relativeCorrectIds: Array.isArray(parsed.relativeCorrectIds)
        ? parsed.relativeCorrectIds
        : [],
      masteredVocabIds: Array.isArray(parsed.masteredVocabIds) ? parsed.masteredVocabIds : [],
      bestGameAccuracy:
        typeof parsed.bestGameAccuracy === 'number' ? parsed.bestGameAccuracy : null,
      gamesPlayed: typeof parsed.gamesPlayed === 'number' ? parsed.gamesPlayed : 0,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('overview');
  const [progress, setProgress] = useState<LearningProgress>(loadProgress);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors
    }
  }, [progress]);

  const handleNavigate = (section: AppSection) => {
    stopSpeaking();
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkTenseCorrect = (exerciseId: string) => {
    setProgress((prev) => {
      if (prev.tenseCorrectIds.includes(exerciseId)) return prev;
      return {
        ...prev,
        tenseCorrectIds: [...prev.tenseCorrectIds, exerciseId],
      };
    });
  };

  const handleMarkRelativeCorrect = (exerciseId: string) => {
    setProgress((prev) => {
      if (prev.relativeCorrectIds.includes(exerciseId)) return prev;
      return {
        ...prev,
        relativeCorrectIds: [...prev.relativeCorrectIds, exerciseId],
      };
    });
  };

  const handleToggleMasteredVocab = (wordId: string) => {
    setProgress((prev) => {
      const exists = prev.masteredVocabIds.includes(wordId);
      return {
        ...prev,
        masteredVocabIds: exists
          ? prev.masteredVocabIds.filter((id) => id !== wordId)
          : [...prev.masteredVocabIds, wordId],
      };
    });
  };

  const handleGameComplete = (accuracyPercent: number) => {
    setProgress((prev) => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      bestGameAccuracy:
        prev.bestGameAccuracy === null
          ? accuracyPercent
          : Math.max(prev.bestGameAccuracy, accuracyPercent),
    }));
  };

  const handleResetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {activeSection === 'overview' && (
          <OverviewSection
            progress={progress}
            totalTenseExercises={TENSE_EXERCISES.length}
            totalRelativeExercises={RELATIVE_EXERCISES.length}
            totalVocabCount={VSTEP_VOCABULARY.length}
            onNavigate={handleNavigate}
            onResetProgress={handleResetProgress}
          />
        )}

        {activeSection === 'tenses' && (
          <TenseModule
            correctIds={progress.tenseCorrectIds}
            onMarkCorrect={handleMarkTenseCorrect}
          />
        )}

        {activeSection === 'relative' && (
          <RelativeClauseModule
            correctIds={progress.relativeCorrectIds}
            onMarkCorrect={handleMarkRelativeCorrect}
          />
        )}

        {(activeSection === 'vstep-vocab' || activeSection === 'vstep-game') && (
          <VstepVocabAndGameModule
            initialMode={activeSection === 'vstep-game' ? 'game' : 'vocab'}
            masteredIds={progress.masteredVocabIds}
            onToggleMastered={handleToggleMasteredVocab}
            onGameComplete={handleGameComplete}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Nền Tảng Anh Ngữ · Ngữ pháp cho người mất gốc &amp; Từ vựng VSTEP</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleNavigate('tenses')}
              className="hover:text-slate-900 transition-colors"
            >
              6 Thì cơ bản
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('relative')}
              className="hover:text-slate-900 transition-colors"
            >
              Mệnh đề quan hệ
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('vstep-game')}
              className="hover:text-slate-900 transition-colors"
            >
              Game nghe VSTEP
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
