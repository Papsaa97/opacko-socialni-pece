import type { CaseScenario, QuizQuestion } from '../types/study';
import { QUIZ_QUESTIONS as RAW_QUIZ_QUESTIONS } from './questions';
import { CASE_SCENARIOS as RAW_CASE_SCENARIOS } from './scenarios';

export { STUDY_MODULES } from './modules';
export { FLASHCARDS } from './flashcards';
export { GLOSSARY_TERMS } from './glossary';
export {
  DECUBITUS_HOTSPOTS,
  DECUBITUS_STAGES,
  TEN_BASIC_LIFE_NEEDS,
  FIFTEEN_QUALITY_STANDARDS,
  VITAL_SIGNS_REFERENCE,
  COMPETENCY_MATRIX,
} from './referenceData';

/** Stable string hash (FNV-1a) so the answer order is the same on every device and reload. */
function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Deterministic Fisher–Yates shuffle seeded by an id (mulberry32 PRNG). */
export function seededShuffle<T>(items: readonly T[], seedKey: string): T[] {
  let seed = hashString(seedKey);
  const random = () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * The source data was authored with the correct answer mostly in position B.
 * Shuffle the options (stably, per question id) so the right answer can't be guessed by position.
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = RAW_QUIZ_QUESTIONS.map((q) => {
  const order = seededShuffle(
    q.options.map((_, index) => index),
    `quiz:${q.id}`
  );
  return {
    ...q,
    options: order.map((index) => q.options[index]),
    correctIndex: order.indexOf(q.correctIndex),
  };
});

export const CASE_SCENARIOS: CaseScenario[] = RAW_CASE_SCENARIOS.map((s) => ({
  ...s,
  choices: seededShuffle(s.choices, `scenario:${s.id}`),
}));
