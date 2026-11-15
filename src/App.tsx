import { useState } from 'react';
import type { ModuleId, NavViewId } from './types/study';
import { useStudyProgress } from './hooks/useStudyProgress';
import { Layout } from './components/Layout';
import { DashboardView } from './components/DashboardView';
import { ModulesView } from './components/ModulesView';
import { FlashcardsView } from './components/FlashcardsView';
import { QuizView, type QuizMode } from './components/QuizView';
import { ScenariosView } from './components/ScenariosView';
import { ToolsView } from './components/ToolsView';
import { GlossaryView } from './components/GlossaryView';
import { CheatSheetView } from './components/CheatSheetView';

function safeScrollTop() {
  try {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } catch {
    // Ignore in environments without scrollTo support (e.g. jsdom)
  }
}

export function App() {
  const {
    progress,
    toggleTheme,
    rateCard,
    toggleModuleCompleted,
    recordQuestionResult,
    recordScenarioResult,
    addExamAttempt,
    exportProgressJson,
    importProgressJson,
    resetProgress,
  } = useStudyProgress();

  const [activeView, setActiveView] = useState<NavViewId>('dashboard');
  const [selectedModuleId, setSelectedModuleId] = useState<ModuleId>('legislativa');
  const [flashcardModuleFilter, setFlashcardModuleFilter] = useState<ModuleId | 'all'>('all');
  const [quizMode, setQuizMode] = useState<QuizMode>('quick10');
  const [quizModuleId, setQuizModuleId] = useState<ModuleId>('legislativa');

  const handleNavigate = (view: NavViewId, moduleId?: ModuleId) => {
    setActiveView(view);
    if (moduleId) {
      setSelectedModuleId(moduleId);
      if (view === 'flashcards') {
        setFlashcardModuleFilter(moduleId);
      } else if (view === 'quiz') {
        setQuizMode('module');
        setQuizModuleId(moduleId);
      }
    } else if (view === 'flashcards') {
      setFlashcardModuleFilter('all');
    }
    safeScrollTop();
  };

  const handleStartQuickQuiz = (mode: 'quick10' | 'exam' | 'mistakes') => {
    setQuizMode(mode);
    setActiveView('quiz');
    safeScrollTop();
  };

  return (
    <Layout
      activeView={activeView}
      onNavigate={handleNavigate}
      progress={progress}
      onToggleTheme={toggleTheme}
      onExportJson={exportProgressJson}
      onImportJson={importProgressJson}
      onResetProgress={resetProgress}
    >
      {activeView === 'dashboard' && (
        <DashboardView
          progress={progress}
          onNavigate={handleNavigate}
          onStartQuickQuiz={handleStartQuickQuiz}
        />
      )}

      {activeView === 'modules' && (
        <ModulesView
          selectedModuleId={selectedModuleId}
          onSelectModule={setSelectedModuleId}
          progress={progress}
          onToggleModuleCompleted={toggleModuleCompleted}
          onNavigate={handleNavigate}
        />
      )}

      {activeView === 'flashcards' && (
        <FlashcardsView
          initialModuleFilter={flashcardModuleFilter}
          progress={progress}
          onRateCard={rateCard}
        />
      )}

      {activeView === 'quiz' && (
        <QuizView
          initialMode={quizMode}
          initialModuleId={quizModuleId}
          progress={progress}
          onRecordQuestionResult={recordQuestionResult}
          onAddExamAttempt={addExamAttempt}
        />
      )}

      {activeView === 'scenarios' && (
        <ScenariosView
          progress={progress}
          onRecordScenario={recordScenarioResult}
        />
      )}

      {activeView === 'tools' && <ToolsView />}

      {activeView === 'glossary' && <GlossaryView />}

      {activeView === 'cheatsheet' && <CheatSheetView />}
    </Layout>
  );
}

export default App;
