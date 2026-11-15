import { describe, expect, it } from 'vitest';
import {
  CASE_SCENARIOS,
  FLASHCARDS,
  GLOSSARY_TERMS,
  QUIZ_QUESTIONS,
  STUDY_MODULES,
} from '../data';
import {
  calculateCareAllowance,
  calculateHomeFee,
  calculateNortonScore,
  drawOralExamTicket,
  generateExamSet,
  getDaysUntilExam,
  getRecommendedNextAction,
  normalizeCzech,
  selectSmartFlashcards,
  toCzechVocative,
} from '../utils/studyLogic';
import { INITIAL_PROGRESS } from '../hooks/useStudyProgress';

describe('Content Completeness & Integrity', () => {
  it('contains all 8 unique study modules with rich sections, tips, and traps', () => {
    expect(STUDY_MODULES).toHaveLength(8);
    const ids = new Set(STUDY_MODULES.map((m) => m.id));
    expect(ids.size).toBe(8);
    for (const mod of STUDY_MODULES) {
      expect(mod.sections.length).toBeGreaterThanOrEqual(3);
      expect(mod.examTips.length).toBeGreaterThanOrEqual(1);
      expect(mod.examTraps.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('contains at least 80 unique flashcards and at least 8 per module', () => {
    expect(FLASHCARDS.length).toBeGreaterThanOrEqual(80);
    const ids = new Set(FLASHCARDS.map((c) => c.id));
    expect(ids.size).toBe(FLASHCARDS.length);

    for (const mod of STUDY_MODULES) {
      const count = FLASHCARDS.filter((c) => c.moduleId === mod.id).length;
      expect(count).toBeGreaterThanOrEqual(8);
    }
  });

  it('contains at least 96 valid quiz questions and at least 10 per module', () => {
    expect(QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(96);
    const ids = new Set(QUIZ_QUESTIONS.map((q) => q.id));
    expect(ids.size).toBe(QUIZ_QUESTIONS.length);

    for (const q of QUIZ_QUESTIONS) {
      expect(q.options.length).toBeGreaterThanOrEqual(3);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
      expect(q.explanation.trim().length).toBeGreaterThan(10);
    }

    for (const mod of STUDY_MODULES) {
      const count = QUIZ_QUESTIONS.filter((q) => q.moduleId === mod.id).length;
      expect(count).toBeGreaterThanOrEqual(10);
    }
  });

  it('contains at least 12 valid case scenarios with exactly one best choice', () => {
    expect(CASE_SCENARIOS.length).toBeGreaterThanOrEqual(12);
    const ids = new Set(CASE_SCENARIOS.map((s) => s.id));
    expect(ids.size).toBe(CASE_SCENARIOS.length);

    for (const s of CASE_SCENARIOS) {
      expect(s.choices.length).toBeGreaterThanOrEqual(3);
      const bestCount = s.choices.filter((c) => c.isBest).length;
      expect(bestCount).toBe(1);
      expect(s.oralExamModelAnswer.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('contains at least 65 unique glossary terms', () => {
    expect(GLOSSARY_TERMS.length).toBeGreaterThanOrEqual(65);
    const ids = new Set(GLOSSARY_TERMS.map((g) => g.id));
    expect(ids.size).toBe(GLOSSARY_TERMS.length);
  });
});

describe('Czech Normalization & Statutory 2026 Calculations', () => {
  it('strips Czech diacritics consistently for search', () => {
    expect(normalizeCzech('Afázie')).toBe('afazie');
    expect(normalizeCzech('Příspěvek na péči (§ 8)')).toBe('prispevek na peci (§ 8)');
    expect(normalizeCzech('Škála Nortonové')).toBe('skala nortonove');
  });

  it('computes exact 2026 Příspěvek na péči for adults (18+)', () => {
    expect(calculateCareAllowance(2, true, true).monthlyAmountCzk).toBe(0);
    expect(calculateCareAllowance(3, true, true).monthlyAmountCzk).toBe(1300);
    expect(calculateCareAllowance(5, true, true).monthlyAmountCzk).toBe(5400);
    expect(calculateCareAllowance(8, true, true).monthlyAmountCzk).toBe(14800);
    expect(calculateCareAllowance(9, true, true).monthlyAmountCzk).toBe(23000);
    expect(calculateCareAllowance(10, true, false).monthlyAmountCzk).toBe(27000);
  });

  it('computes exact 2026 Příspěvek na péči for children (<18)', () => {
    expect(calculateCareAllowance(2, false, false).monthlyAmountCzk).toBe(0);
    expect(calculateCareAllowance(3, false, false).monthlyAmountCzk).toBe(4900);
    expect(calculateCareAllowance(4, false, false).monthlyAmountCzk).toBe(8200);
    expect(calculateCareAllowance(7, false, false).monthlyAmountCzk).toBe(16100);
    expect(calculateCareAllowance(9, false, true).monthlyAmountCzk).toBe(23000);
    expect(calculateCareAllowance(9, false, false).monthlyAmountCzk).toBe(27000);
  });

  it('enforces 2026 daily caps and 15% mandatory income remainder (§ 73 odst. 3)', () => {
    // Low pension: 10 000 Kč -> 15% remainder is 1 500 Kč, max payable 8 500 Kč
    const lowPension = calculateHomeFee(30, 500, 400, false, 10000, 5400);
    expect(lowPension.cappedRoomDailyCzk).toBe(335);
    expect(lowPension.cappedFoodDailyCzk).toBe(290);
    expect(lowPension.fullMonthlyCostCzk).toBe(30 * (335 + 290));
    expect(lowPension.isReducedBy15PercentRule).toBe(true);
    expect(lowPension.actualMonthlyPaymentCzk).toBe(8500);
    expect(lowPension.actualClientRemainderCzk).toBe(1500);

    // High pension: 30 000 Kč in single room (380 + 290 = 670 * 30 = 20 100 Kč)
    const highPension = calculateHomeFee(30, 380, 290, true, 30000, 14800);
    expect(highPension.cappedRoomDailyCzk).toBe(380);
    expect(highPension.isReducedBy15PercentRule).toBe(false);
    expect(highPension.actualMonthlyPaymentCzk).toBe(20100);
    expect(highPension.actualClientRemainderCzk).toBe(9900);
  });

  it('classifies Norton decubitus risk accurately', () => {
    expect(
      calculateNortonScore({ physical: 1, mental: 2, activity: 1, mobility: 2, incontinence: 2 })
        .riskLevel
    ).toBe('high');
    expect(
      calculateNortonScore({ physical: 3, mental: 3, activity: 3, mobility: 2, incontinence: 3 })
        .riskLevel
    ).toBe('medium');
    expect(
      calculateNortonScore({ physical: 4, mental: 4, activity: 4, mobility: 3, incontinence: 4 })
        .riskLevel
    ).toBe('low');
  });

  it('prioritizes struggling flashcards and builds stratified 25-question exams', () => {
    const ordered = selectSmartFlashcards(
      FLASHCARDS,
      { [FLASHCARDS[0].id]: 3, [FLASHCARDS[1].id]: 1 },
      'all',
      false
    );
    expect(ordered[0].id).toBe(FLASHCARDS[1].id);

    const exam = generateExamSet(QUIZ_QUESTIONS, 25);
    expect(exam).toHaveLength(25);
    const examModuleCoverage = new Set(exam.map((q) => q.moduleId));
    expect(examModuleCoverage.size).toBe(8);
  });

  it('computes exam day countdown, smart daily recommendations, and oral exam tickets', () => {
    expect(getDaysUntilExam('2026-11-25', '2026-11-15')).toBe(10);
    expect(getDaysUntilExam('2026-11-15', '2026-11-15')).toBe(0);
    expect(getDaysUntilExam('2026-11-10', '2026-11-15')).toBe(-5);
    expect(getDaysUntilExam(null, '2026-11-15')).toBeNull();

    const withMistakes = {
      ...INITIAL_PROGRESS,
      mistakeQuestionIds: [QUIZ_QUESTIONS[0].id],
    };
    expect(
      getRecommendedNextAction(
        withMistakes,
        STUDY_MODULES,
        FLASHCARDS,
        QUIZ_QUESTIONS,
        CASE_SCENARIOS
      ).actionType
    ).toBe('mistakes');

    expect(
      getRecommendedNextAction(
        INITIAL_PROGRESS,
        STUDY_MODULES,
        FLASHCARDS,
        QUIZ_QUESTIONS,
        CASE_SCENARIOS
      ).actionType
    ).toBe('module');

    const ticket = drawOralExamTicket(
      STUDY_MODULES,
      CASE_SCENARIOS,
      STUDY_MODULES[0].id,
      CASE_SCENARIOS[0].id
    );
    expect(ticket.module.id).not.toBe(STUDY_MODULES[0].id);
    expect(ticket.scenario.id).not.toBe(CASE_SCENARIOS[0].id);
  });
});

describe('Answer order & greeting polish', () => {
  it('spreads correct quiz answers across positions so they cannot be guessed (no position > 40 %)', () => {
    const counts = [0, 0, 0, 0];
    for (const q of QUIZ_QUESTIONS) counts[q.correctIndex]++;
    for (const c of counts) {
      expect(c / QUIZ_QUESTIONS.length).toBeLessThan(0.4);
    }
  });

  it('does not always put the best scenario choice in the same position', () => {
    const positions = new Set(CASE_SCENARIOS.map((s) => s.choices.findIndex((c) => c.isBest)));
    expect(positions.size).toBeGreaterThan(1);
  });

  it('builds a simple Czech vocative for the greeting', () => {
    expect(toCzechVocative('Jana')).toBe('Jano');
    expect(toCzechVocative('Petra')).toBe('Petro');
    expect(toCzechVocative('Terko')).toBe('Terko');
    expect(toCzechVocative('Lucie')).toBe('Lucie');
    expect(toCzechVocative('Tomáš')).toBe('Tomáš');
  });
});