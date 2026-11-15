import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  XCircle,
} from 'lucide-react';
import type { ExamAttempt, ModuleId, QuizQuestion, UserProgress } from '../types/study';
import { QUIZ_QUESTIONS, STUDY_MODULES } from '../data';
import {
  CARE_LAW_2026_CONSTANTS,
  formatTimeMMSS,
  generateExamSet,
  shuffleArray,
} from '../utils/studyLogic';

export type QuizMode = 'module' | 'quick10' | 'mistakes' | 'exam';

interface QuizViewProps {
  initialMode: QuizMode;
  initialModuleId: ModuleId;
  progress: UserProgress;
  onRecordQuestionResult: (questionId: string, isCorrect: boolean) => void;
  onAddExamAttempt: (attempt: ExamAttempt) => void;
  onNavigateToModule?: (moduleId: ModuleId) => void;
}

const EXAM_DURATION_SECONDS = 30 * 60;

interface PracticeLogItem {
  question: QuizQuestion;
  chosenIndex: number;
  isCorrect: boolean;
}

export const QuizView: React.FC<QuizViewProps> = ({
  initialMode,
  initialModuleId,
  progress,
  onRecordQuestionResult,
  onAddExamAttempt,
  onNavigateToModule,
}) => {
  const [mode, setMode] = useState<QuizMode>(initialMode);
  const [moduleId, setModuleId] = useState<ModuleId>(initialModuleId);
  const [onlyUnmasteredInModule, setOnlyUnmasteredInModule] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Practice modes
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [sessionScore, setSessionScore] = useState({ correct: 0, answered: 0 });
  const [practiceLog, setPracticeLog] = useState<PracticeLogItem[]>([]);
  const [practiceFinished, setPracticeFinished] = useState(false);

  // Exam mode
  const [examAnswers, setExamAnswers] = useState<Record<string, number>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(EXAM_DURATION_SECONDS);

  const buildSession = (
    targetMode: QuizMode,
    targetModule: ModuleId,
    unmasteredOnly = onlyUnmasteredInModule
  ) => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setSessionScore({ correct: 0, answered: 0 });
    setPracticeLog([]);
    setPracticeFinished(false);
    setExamAnswers({});
    setExamSubmitted(false);
    setConfirmSubmitOpen(false);
    setSecondsLeft(EXAM_DURATION_SECONDS);

    if (targetMode === 'module') {
      const basePool = QUIZ_QUESTIONS.filter((q) => q.moduleId === targetModule);
      const filtered = unmasteredOnly
        ? basePool.filter((q) => progress.answeredQuestions[q.id] !== true)
        : basePool;
      setSessionQuestions(shuffleArray(filtered));
    } else if (targetMode === 'quick10') {
      setSessionQuestions(generateExamSet(QUIZ_QUESTIONS, 10));
    } else if (targetMode === 'mistakes') {
      const mistakePool = QUIZ_QUESTIONS.filter((q) =>
        progress.mistakeQuestionIds.includes(q.id)
      );
      setSessionQuestions(shuffleArray(mistakePool));
    } else {
      setSessionQuestions(generateExamSet(QUIZ_QUESTIONS, 25));
    }
  };

  useEffect(() => {
    setMode(initialMode);
    setModuleId(initialModuleId);
    buildSession(initialMode, initialModuleId, onlyUnmasteredInModule);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMode, initialModuleId]);

  useEffect(() => {
    if (mode !== 'exam' || examSubmitted || sessionQuestions.length === 0) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [mode, examSubmitted, sessionQuestions.length]);

  useEffect(() => {
    if (mode === 'exam' && !examSubmitted && secondsLeft === 0 && sessionQuestions.length > 0) {
      submitExamNow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const handleModeSwitch = (nextMode: QuizMode) => {
    setMode(nextMode);
    buildSession(nextMode, moduleId, onlyUnmasteredInModule);
  };

  const handleModuleChange = (nextMod: ModuleId) => {
    setModuleId(nextMod);
    if (mode === 'module') {
      buildSession('module', nextMod, onlyUnmasteredInModule);
    }
  };

  const currentQuestion = sessionQuestions[currentIdx];

  const handlePracticeAnswer = (optIndex: number) => {
    if (!currentQuestion || selectedOption !== null) return;
    setSelectedOption(optIndex);
    const isCorrect = optIndex === currentQuestion.correctIndex;
    onRecordQuestionResult(currentQuestion.id, isCorrect);
    setPracticeLog((prev) => [...prev, { question: currentQuestion, chosenIndex: optIndex, isCorrect }]);
    setSessionScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      answered: prev.answered + 1,
    }));
  };

  const handleNextPractice = () => {
    if (currentIdx + 1 >= sessionQuestions.length) {
      setPracticeFinished(true);
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
    }
  };

  // Keyboard shortcuts for practice mode (1-4 / A-D and Enter/RightArrow)
  useEffect(() => {
    if (mode === 'exam' || practiceFinished || !currentQuestion) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      if (selectedOption === null) {
        const keyMap: Record<string, number> = {
          '1': 0,
          '2': 1,
          '3': 2,
          '4': 3,
          a: 0,
          b: 1,
          c: 2,
          d: 3,
        };
        const mapped = keyMap[e.key.toLowerCase()];
        if (mapped !== undefined && mapped < currentQuestion.options.length) {
          e.preventDefault();
          handlePracticeAnswer(mapped);
        }
      } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextPractice();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const handleExamSelect = (optIndex: number) => {
    if (!currentQuestion || examSubmitted) return;
    setExamAnswers((prev) => ({ ...prev, [currentQuestion.id]: optIndex }));
  };

  const submitExamNow = () => {
    if (examSubmitted) return;
    let correct = 0;
    const byModule: Partial<Record<ModuleId, { correct: number; total: number }>> = {};

    for (const q of sessionQuestions) {
      const chosen = examAnswers[q.id];
      const isRight = chosen === q.correctIndex;
      onRecordQuestionResult(q.id, isRight);
      if (isRight) correct++;

      const cur = byModule[q.moduleId] ?? { correct: 0, total: 0 };
      cur.total += 1;
      if (isRight) cur.correct += 1;
      byModule[q.moduleId] = cur;
    }

    const total = sessionQuestions.length;
    const passed = total > 0 && correct / total >= CARE_LAW_2026_CONSTANTS.EXAM_PASS_RATIO;
    const durationSeconds = EXAM_DURATION_SECONDS - secondsLeft;

    onAddExamAttempt({
      id: `exam-${Date.now()}`,
      dateIso: new Date().toISOString(),
      score: correct,
      total,
      passed,
      durationSeconds,
      byModule,
    });
    setConfirmSubmitOpen(false);
    setExamSubmitted(true);
  };

  const handleAttemptSubmitExam = () => {
    if (examSubmitted) return;
    const answeredCount = Object.keys(examAnswers).length;
    if (answeredCount < sessionQuestions.length && !confirmSubmitOpen) {
      setConfirmSubmitOpen(true);
      return;
    }
    submitExamNow();
  };

  const examSummary = useMemo(() => {
    if (!examSubmitted) return null;
    let correct = 0;
    const byModule: Partial<Record<ModuleId, { correct: number; total: number }>> = {};
    for (const q of sessionQuestions) {
      const isRight = examAnswers[q.id] === q.correctIndex;
      if (isRight) correct++;
      const cur = byModule[q.moduleId] ?? { correct: 0, total: 0 };
      cur.total += 1;
      if (isRight) cur.correct += 1;
      byModule[q.moduleId] = cur;
    }
    const total = sessionQuestions.length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = pct >= 75;
    return { correct, total, pct, passed, byModule };
  }, [examSubmitted, sessionQuestions, examAnswers]);

  const moduleNameMap = useMemo(
    () => new Map(STUDY_MODULES.map((m) => [m.id, m.shortTitle])),
    []
  );

  const missedPracticeItems = useMemo(
    () => practiceLog.filter((item) => !item.isCorrect),
    [practiceLog]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Testy & Zkouška nanečisto
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Celkem {QUIZ_QUESTIONS.length} testových otázek s podrobným zdůvodněním každé odpovědi.
          </p>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          type="button"
          onClick={() => handleModeSwitch('module')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            mode === 'module'
              ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-400'
          }`}
        >
          <div className="text-xs font-bold">Podle okruhu</div>
          <div className={`text-[11px] ${mode === 'module' ? 'text-teal-100' : 'text-slate-500'}`}>
            12 otázek s výkladem
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleModeSwitch('quick10')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            mode === 'quick10'
              ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-400'
          }`}
        >
          <div className="text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Rychlá desítka
          </div>
          <div className={`text-[11px] ${mode === 'quick10' ? 'text-teal-100' : 'text-slate-500'}`}>
            Mix ze všech okruhů
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleModeSwitch('mistakes')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            mode === 'mistakes'
              ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-400'
          }`}
        >
          <div className="text-xs font-bold flex items-center justify-between">
            <span>Chybovník</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                mode === 'mistakes'
                  ? 'bg-white/20 text-white'
                  : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-200'
              }`}
            >
              {progress.mistakeQuestionIds.length}
            </span>
          </div>
          <div className={`text-[11px] ${mode === 'mistakes' ? 'text-rose-100' : 'text-slate-500'}`}>
            Oprava minulých chyb
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleModeSwitch('exam')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            mode === 'exam'
              ? 'bg-amber-600 border-amber-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400'
          }`}
        >
          <div className="text-xs font-bold flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> Zkouška nanečisto
          </div>
          <div className={`text-[11px] ${mode === 'exam' ? 'text-amber-100' : 'text-slate-500'}`}>
            25 otázek · 30 minut
          </div>
        </button>
      </div>

      {/* Module picker for 'module' mode */}
      {mode === 'module' && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              <span>Okruh:</span>
              <select
                value={moduleId}
                onChange={(e) => handleModuleChange(e.target.value as ModuleId)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold outline-none focus:border-teal-500"
              >
                {STUDY_MODULES.map((m) => {
                  const modQs = QUIZ_QUESTIONS.filter((q) => q.moduleId === m.id);
                  const modRight = modQs.filter((q) => progress.answeredQuestions[q.id] === true).length;
                  return (
                    <option key={m.id} value={m.id}>
                      {m.order}. {m.shortTitle} ({modRight}/{modQs.length} ✓)
                    </option>
                  );
                })}
              </select>
            </label>

            <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer select-none px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <input
                type="checkbox"
                checked={onlyUnmasteredInModule}
                onChange={(e) => {
                  const nextVal = e.target.checked;
                  setOnlyUnmasteredInModule(nextVal);
                  buildSession('module', moduleId, nextVal);
                }}
                className="accent-teal-600 w-4 h-4"
              />
              Jen nezvládnuté
            </label>
          </div>

          <button
            type="button"
            onClick={() => buildSession('module', moduleId, onlyUnmasteredInModule)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Zamíchat otázky znovu
          </button>
        </div>
      )}

      {/* Empty Module Filtered Pool */}
      {mode === 'module' && sessionQuestions.length === 0 && (
        <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold">Všechny otázky tohoto okruhu už umíte správně!</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Zrušte filtr „Jen nezvládnuté“ pro plné zopakování nebo vyberte další okruh.
          </p>
        </div>
      )}

      {/* Empty Mistake Bank */}
      {mode === 'mistakes' && sessionQuestions.length === 0 && (
        <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold">Chybovník je úplně prázdný!</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Momentálně nemáte žádné nezvládnuté otázky k opravě. Zkuste Rychlou desítku nebo
            Zkoušku nanečisto.
          </p>
        </div>
      )}

      {/* PRACTICE MODES (module, quick10, mistakes) */}
      {mode !== 'exam' && sessionQuestions.length > 0 && (
        <>
          {practiceFinished ? (
            <div className="space-y-5">
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
                <Award className="w-12 h-12 text-teal-600 mx-auto" />
                <h3 className="text-2xl font-extrabold">Trénink dokončen!</h3>
                <p className="text-base text-slate-700 dark:text-slate-200">
                  Správně zodpovězeno:{' '}
                  <strong className="text-teal-700 dark:text-teal-400">
                    {sessionScore.correct} z {sessionScore.answered}
                  </strong>{' '}
                  (
                  {sessionScore.answered > 0
                    ? Math.round((sessionScore.correct / sessionScore.answered) * 100)
                    : 0}{' '}
                  %)
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => buildSession(mode, moduleId, onlyUnmasteredInModule)}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold cursor-pointer"
                  >
                    Spustit znovu
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('exam')}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold cursor-pointer"
                  >
                    Zkusit Zkoušku nanečisto
                  </button>
                </div>
              </div>

              {missedPracticeItems.length > 0 && (
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    Zopakujte si chyby z tohoto tréninku ({missedPracticeItems.length})
                  </h4>
                  <div className="space-y-2.5">
                    {missedPracticeItems.map(({ question, chosenIndex }) => (
                      <div
                        key={question.id}
                        className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-1.5"
                      >
                        <div className="text-sm font-bold">{question.question}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-300">
                          Vaše volba: <strong>{question.options[chosenIndex]}</strong> · Správně:{' '}
                          <strong className="text-emerald-700 dark:text-emerald-400">
                            {question.options[question.correctIndex]}
                          </strong>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {question.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            currentQuestion && (
              <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-semibold">
                      {moduleNameMap.get(currentQuestion.moduleId)}
                    </span>
                    <span className="font-semibold text-slate-500 dark:text-slate-400">
                      Otázka {currentIdx + 1} z {sessionQuestions.length} · Úspěšnost:{' '}
                      {sessionScore.correct}/{sessionScore.answered}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-teal-600 transition-all duration-300"
                      style={{
                        width: `${Math.round(((currentIdx + 1) / sessionQuestions.length) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                  {currentQuestion.question}
                </h3>

                <div className="space-y-2.5">
                  {currentQuestion.options.map((opt, idx) => {
                    const isAnswered = selectedOption !== null;
                    const isChosen = selectedOption === idx;
                    const isRight = idx === currentQuestion.correctIndex;

                    let cardStyle =
                      'border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-teal-50/40 dark:hover:bg-slate-800/80';
                    if (isAnswered) {
                      if (isRight) {
                        cardStyle =
                          'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-100';
                      } else if (isChosen && !isRight) {
                        cardStyle =
                          'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-950 dark:text-rose-100';
                      } else {
                        cardStyle = 'border-slate-200 dark:border-slate-800 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => handlePracticeAnswer(idx)}
                        className={`w-full text-left p-4 rounded-2xl border-2 text-sm sm:text-base font-medium transition-all flex items-start gap-3 cursor-pointer disabled:cursor-default ${cardStyle}`}
                      >
                        <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isAnswered && isRight && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                        {isAnswered && isChosen && !isRight && (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedOption !== null && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-sm font-bold ${
                          selectedOption === currentQuestion.correctIndex
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {selectedOption === currentQuestion.correctIndex
                          ? 'Správně!'
                          : 'Pozor, tady byl chyták!'}
                      </span>
                      {currentQuestion.legalOrClinicalRef && (
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {currentQuestion.legalOrClinicalRef}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                      {onNavigateToModule ? (
                        <button
                          type="button"
                          onClick={() => onNavigateToModule(currentQuestion.moduleId)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 dark:hover:text-teal-400 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          Zobrazit výklad k okruhu
                        </button>
                      ) : (
                        <span />
                      )}
                      <button
                        type="button"
                        onClick={handleNextPractice}
                        className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold cursor-pointer"
                      >
                        {currentIdx + 1 >= sessionQuestions.length
                          ? 'Dokončit a zobrazit výsledek'
                          : 'Další otázka →'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </>
      )}

      {/* EXAM SIMULATION MODE */}
      {mode === 'exam' && sessionQuestions.length > 0 && (
        <>
          {examSubmitted && examSummary ? (
            <div className="space-y-6">
              <div
                className={`p-6 sm:p-8 rounded-3xl border-2 text-center space-y-3 ${
                  examSummary.passed
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700'
                }`}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/70 text-xs font-bold">
                  {examSummary.passed ? (
                    <span className="text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> ZKOUŠKA NANEČISTO SPLNĚNA (≥ 75 %)
                    </span>
                  ) : (
                    <span className="text-rose-700 dark:text-rose-300 flex items-center gap-1">
                      <ShieldAlert className="w-4 h-4" /> ZATÍM POD HRANICÍ 75 % – DOPORUČUJEME OPAKOVAT
                    </span>
                  )}
                </div>

                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {examSummary.correct} / {examSummary.total} bodů ({examSummary.pct} %)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Všechny chybné otázky se automaticky uložily do vašeho Chybovníku k procvičení.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => buildSession('exam', moduleId)}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold cursor-pointer"
                  >
                    Spustit nový zkušební test (jiné otázky)
                  </button>
                  {progress.mistakeQuestionIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('mistakes')}
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold cursor-pointer"
                    >
                      Opravit chyby ({progress.mistakeQuestionIds.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Breakdown by module */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-bold text-sm uppercase tracking-wider text-slate-500">
                  Výsledek podle okruhů
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {STUDY_MODULES.map((m) => {
                    const stats = examSummary.byModule[m.id];
                    if (!stats) return null;
                    const modPct = Math.round((stats.correct / stats.total) * 100);
                    return (
                      <div
                        key={m.id}
                        className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 text-sm"
                      >
                        <span className="font-medium">{m.shortTitle}</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              modPct >= 75
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {stats.correct}/{stats.total} ({modPct} %)
                          </span>
                          {modPct < 75 && onNavigateToModule && (
                            <button
                              type="button"
                              onClick={() => onNavigateToModule(m.id)}
                              className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-teal-700 dark:text-teal-300 cursor-pointer"
                            >
                              Zopakovat
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Question Review */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm uppercase tracking-wider text-slate-500">
                  Přehled všech odpovědí a vysvětlení
                </h4>
                {sessionQuestions.map((q, idx) => {
                  const chosen = examAnswers[q.id];
                  const isRight = chosen === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border ${
                        isRight
                          ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/50'
                          : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                      } space-y-1.5`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-bold">
                          {idx + 1}. {q.question}
                        </div>
                        {isRight ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        Vaše odpověď:{' '}
                        <strong>
                          {chosen !== undefined ? q.options[chosen] : 'Nezodpovězeno'}
                        </strong>
                        {!isRight && (
                          <>
                            {' '}
                            · Správně:{' '}
                            <strong className="text-emerald-700 dark:text-emerald-400">
                              {q.options[q.correctIndex]}
                            </strong>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{q.explanation}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Exam Top Status Bar */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-sm font-bold">
                      <Clock className="w-4 h-4" />
                      {formatTimeMMSS(secondsLeft)}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                      Zodpovězeno: {Object.keys(examAnswers).length} / {sessionQuestions.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAttemptSubmitExam}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold cursor-pointer"
                  >
                    Odevzdat a vyhodnotit zkoušku
                  </button>
                </div>

                {confirmSubmitOpen && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                    <span className="font-semibold text-amber-900 dark:text-amber-200">
                      Zbývá {sessionQuestions.length - Object.keys(examAnswers).length} nezodpovězených
                      otázek – opravdu chcete test rovnou odevzdat?
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmSubmitOpen(false)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-semibold cursor-pointer"
                      >
                        Pokračovat v testu
                      </button>
                      <button
                        type="button"
                        onClick={submitExamNow}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                      >
                        Potvrdit odevzdání
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Palette of question numbers */}
              <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                {sessionQuestions.map((q, i) => {
                  const answered = examAnswers[q.id] !== undefined;
                  const active = i === currentIdx;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIdx(i)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        active
                          ? 'bg-teal-600 text-white ring-2 ring-teal-300'
                          : answered
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              {/* Active Exam Question */}
              {currentQuestion && (
                <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold">
                      {moduleNameMap.get(currentQuestion.moduleId)}
                    </span>
                    <span>
                      Otázka {currentIdx + 1} z {sessionQuestions.length}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold">{currentQuestion.question}</h3>

                  <div className="space-y-2.5">
                    {currentQuestion.options.map((opt, idx) => {
                      const chosen = examAnswers[currentQuestion.id] === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleExamSelect(idx)}
                          className={`w-full text-left p-4 rounded-2xl border-2 text-sm sm:text-base font-medium flex items-start gap-3 transition-all cursor-pointer ${
                            chosen
                              ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/50 text-teal-950 dark:text-teal-100'
                              : 'border-slate-200 dark:border-slate-700 hover:border-teal-400'
                          }`}
                        >
                          <span
                            className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                              chosen
                                ? 'bg-teal-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      disabled={currentIdx === 0}
                      onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold disabled:opacity-40 cursor-pointer"
                    >
                      ← Předchozí
                    </button>
                    {currentIdx + 1 < sessionQuestions.length ? (
                      <button
                        type="button"
                        onClick={() => setCurrentIdx((i) => i + 1)}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold cursor-pointer"
                      >
                        Další otázka →
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAttemptSubmitExam}
                        className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold cursor-pointer"
                      >
                        Odevzdat a vyhodnotit zkoušku
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
