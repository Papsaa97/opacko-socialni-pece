import { useCallback, useEffect, useState } from 'react';
import type { CardBoxLevel, ExamAttempt, ModuleId, UserProgress } from '../types/study';

const STORAGE_KEY = 'opacko-pss-progress-v1';

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isYesterday(previousDateStr: string | null, todayStr: string): boolean {
  if (!previousDateStr) return false;
  const prev = new Date(`${previousDateStr}T00:00:00`);
  const today = new Date(`${todayStr}T00:00:00`);
  const diffDays = Math.round((today.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

export const INITIAL_PROGRESS: UserProgress = {
  cardBoxes: {},
  completedModules: [],
  answeredQuestions: {},
  mistakeQuestionIds: [],
  completedScenarios: {},
  examHistory: [],
  lastStudyDate: null,
  streakDays: 0,
  theme: 'light',
};

function withUpdatedStreak(prev: UserProgress): Pick<UserProgress, 'lastStudyDate' | 'streakDays'> {
  const today = getTodayDateString();
  if (prev.lastStudyDate === today) {
    return { lastStudyDate: today, streakDays: Math.max(1, prev.streakDays) };
  }
  if (isYesterday(prev.lastStudyDate, today)) {
    return { lastStudyDate: today, streakDays: prev.streakDays + 1 };
  }
  return { lastStudyDate: today, streakDays: 1 };
}

function loadInitialProgress(): UserProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    return {
      ...INITIAL_PROGRESS,
      ...parsed,
      cardBoxes: parsed.cardBoxes ?? {},
      completedModules: Array.isArray(parsed.completedModules) ? parsed.completedModules : [],
      answeredQuestions: parsed.answeredQuestions ?? {},
      mistakeQuestionIds: Array.isArray(parsed.mistakeQuestionIds) ? parsed.mistakeQuestionIds : [],
      completedScenarios: parsed.completedScenarios ?? {},
      examHistory: Array.isArray(parsed.examHistory) ? parsed.examHistory : [],
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
    };
  } catch {
    return INITIAL_PROGRESS;
  }
}

export function useStudyProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => loadInitialProgress());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota or private file:// restrictions
    }
  }, [progress]);

  useEffect(() => {
    const root = document.documentElement;
    if (progress.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [progress.theme]);

  const toggleTheme = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  }, []);

  const rateCard = useCallback((cardId: string, level: Exclude<CardBoxLevel, 0>) => {
    setProgress((prev) => ({
      ...prev,
      ...withUpdatedStreak(prev),
      cardBoxes: {
        ...prev.cardBoxes,
        [cardId]: level,
      },
    }));
  }, []);

  const toggleModuleCompleted = useCallback((moduleId: ModuleId) => {
    setProgress((prev) => {
      const exists = prev.completedModules.includes(moduleId);
      const completedModules = exists
        ? prev.completedModules.filter((id) => id !== moduleId)
        : [...prev.completedModules, moduleId];
      return {
        ...prev,
        ...withUpdatedStreak(prev),
        completedModules,
      };
    });
  }, []);

  const recordQuestionResult = useCallback((questionId: string, isCorrect: boolean) => {
    setProgress((prev) => {
      const mistakeSet = new Set(prev.mistakeQuestionIds);
      if (isCorrect) {
        mistakeSet.delete(questionId);
      } else {
        mistakeSet.add(questionId);
      }
      return {
        ...prev,
        ...withUpdatedStreak(prev),
        answeredQuestions: {
          ...prev.answeredQuestions,
          [questionId]: isCorrect,
        },
        mistakeQuestionIds: Array.from(mistakeSet),
      };
    });
  }, []);

  const recordScenarioResult = useCallback((scenarioId: string, isBestChoice: boolean) => {
    setProgress((prev) => ({
      ...prev,
      ...withUpdatedStreak(prev),
      completedScenarios: {
        ...prev.completedScenarios,
        [scenarioId]: isBestChoice || Boolean(prev.completedScenarios[scenarioId]),
      },
    }));
  }, []);

  const addExamAttempt = useCallback((attempt: ExamAttempt) => {
    setProgress((prev) => ({
      ...prev,
      ...withUpdatedStreak(prev),
      examHistory: [attempt, ...prev.examHistory].slice(0, 20),
    }));
  }, []);

  const exportProgressJson = useCallback(() => {
    return JSON.stringify(progress, null, 2);
  }, [progress]);

  const importProgressJson = useCallback((rawJson: string): boolean => {
    try {
      const parsed = JSON.parse(rawJson) as Partial<UserProgress>;
      if (!parsed || typeof parsed !== 'object') return false;
      setProgress({
        ...INITIAL_PROGRESS,
        ...parsed,
        cardBoxes: parsed.cardBoxes ?? {},
        completedModules: Array.isArray(parsed.completedModules) ? parsed.completedModules : [],
        answeredQuestions: parsed.answeredQuestions ?? {},
        mistakeQuestionIds: Array.isArray(parsed.mistakeQuestionIds) ? parsed.mistakeQuestionIds : [],
        completedScenarios: parsed.completedScenarios ?? {},
        examHistory: Array.isArray(parsed.examHistory) ? parsed.examHistory : [],
        theme: parsed.theme === 'dark' ? 'dark' : 'light',
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetProgress = useCallback(() => {
    setProgress((prev) => ({
      ...INITIAL_PROGRESS,
      theme: prev.theme,
    }));
  }, []);

  return {
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
  };
}
