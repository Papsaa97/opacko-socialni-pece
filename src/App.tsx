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
    updateProfile,
    incrementOralTicket,
    updateStudyNotes,
    exportProgressJson,
    importProgressJson,
    resetProgress,
  } = useStudyProgress();

  const [activeView, setActiveView] = useState<NavViewId>('dashboard');
  const [selectedModuleId, setSelectedModuleId] = useState<ModuleId>('legislativa');
  const [focusedSectionId, setFocusedSectionId] = useState<string | null>(null);
  const [glossaryQuery, setGlossaryQuery] = useState<string>('');
  const [flashcardModuleFilter, setFlashcardModuleFilter] = useState<ModuleId | 'all'>('all');
  const [quizMode, setQuizMode] = useState<QuizMode>('quick10');
  const [quizModuleId, setQuizModuleId] = useState<ModuleId>('legislativa');

  const handleNavigate = (
    view: NavViewId,
    moduleId?: ModuleId,
    options?: { sectionId?: string; glossaryQuery?: string }
  ) => {
    setActiveView(view);
    setFocusedSectionId(options?.sectionId ?? null);
    setGlossaryQuery(options?.glossaryQuery ?? '');
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
          onUpdateProfile={updateProfile}
        />
      )}

      {activeView === 'modules' && (
        <ModulesView
          selectedModuleId={selectedModuleId}
          focusedSectionId={focusedSectionId}
          onSelectModule={(id) => {
            setSelectedModuleId(id);
            setFocusedSectionId(null);
          }}
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
          onNavigateToModule={(modId) => handleNavigate('modules', modId)}
        />
      )}

      {activeView === 'scenarios' && (
        <ScenariosView
          progress={progress}
          onRecordScenario={recordScenarioResult}
          onIncrementOralTicket={incrementOralTicket}
          onUpdateStudyNotes={updateStudyNotes}
        />
      )}

      {activeView === 'tools' && <ToolsView />}

      {activeView === 'glossary' && <GlossaryView initialQuery={glossaryQuery} />}

      {activeView === 'cheatsheet' && <CheatSheetView />}
    </Layout>
  );
}

export default App;
