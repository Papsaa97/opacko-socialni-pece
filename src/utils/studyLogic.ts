import type {
  CaseScenario,
  Flashcard,
  ModuleId,
  QuizQuestion,
  StudyModule,
  UserProgress,
} from '../types/study';

export const CARE_LAW_2026_CONSTANTS = {
  ROOM_MAX_SHARED_CZK: 335,
  ROOM_MAX_SINGLE_CZK: 380,
  FOOD_MAX_FULL_DAY_CZK: 290,
  FOOD_MAX_LUNCH_CZK: 135,
  MIN_INCOME_REMAINDER_RATIO: 0.15,
  COURSE_MIN_HOURS: 150,
  ANNUAL_TRAINING_MIN_HOURS: 24,
  EXAM_PASS_RATIO: 0.75,
} as const;

export function normalizeCzech(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface CareAllowanceResult {
  degree: 0 | 1 | 2 | 3 | 4;
  degreeLabel: string;
  monthlyAmountCzk: number;
  explanation: string;
}

export function calculateCareAllowance(
  unmetNeedsCount: number,
  isAdult: boolean,
  isResidential: boolean
): CareAllowanceResult {
  const maxNeeds = isAdult ? 10 : 9;
  const clamped = Math.max(0, Math.min(maxNeeds, Math.round(unmetNeedsCount)));

  if (isAdult) {
    if (clamped <= 2) {
      return {
        degree: 0,
        degreeLabel: 'Bez stupně závislosti (nárok nevzniká)',
        monthlyAmountCzk: 0,
        explanation:
          'U osob nad 18 let vzniká nárok na příspěvek na péči při nezvládání alespoň 3 základních životních potřeb (§ 8 zákona č. 108/2006 Sb.).',
      };
    }
    if (clamped <= 4) {
      return {
        degree: 1,
        degreeLabel: 'I. stupeň – lehká závislost (3–4 potřeby)',
        monthlyAmountCzk: 1300,
        explanation:
          'Dospělá osoba nezvládá 3 nebo 4 základní životní potřeby. Výše příspěvku od roku 2026 činí 1 300 Kč měsíčně.',
      };
    }
    if (clamped <= 6) {
      return {
        degree: 2,
        degreeLabel: 'II. stupeň – středně těžká závislost (5–6 potřeb)',
        monthlyAmountCzk: 5400,
        explanation:
          'Dospělá osoba nezvládá 5 nebo 6 základních životních potřeb. Výše příspěvku činí 5 400 Kč měsíčně.',
      };
    }
    if (clamped <= 8) {
      return {
        degree: 3,
        degreeLabel: 'III. stupeň – těžká závislost (7–8 potřeb)',
        monthlyAmountCzk: 14800,
        explanation:
          'Dospělá osoba nezvládá 7 nebo 8 základních životních potřeb. Výše příspěvku činí 14 800 Kč měsíčně.',
      };
    }
    return {
      degree: 4,
      degreeLabel: isResidential
        ? 'IV. stupeň – úplná závislost, pobytová služba (9–10 potřeb)'
        : 'IV. stupeň – úplná závislost, doma / terénní péče (9–10 potřeb)',
      monthlyAmountCzk: isResidential ? 23000 : 27000,
      explanation: isResidential
        ? 'Při úplné závislosti v pobytovém zařízení (např. domov pro seniory) činí příspěvek 23 000 Kč měsíčně (náleží poskytovateli na úhradu péče).'
        : 'Při úplné závislosti v domácím prostředí nebo při využívání terénních služeb činí příspěvek 27 000 Kč měsíčně.',
    };
  }

  // Do 18 let věku (posuzuje se 9 potřeb – bez péče o domácnost)
  if (clamped <= 2) {
    return {
      degree: 0,
      degreeLabel: 'Bez stupně závislosti (nárok nevzniká)',
      monthlyAmountCzk: 0,
      explanation:
        'U osob do 18 let se neposuzuje péče o domácnost (hodnotí se 9 potřeb). Nárok vzniká od 3 nezvládaných potřeb.',
    };
  }
  if (clamped === 3) {
    return {
      degree: 1,
      degreeLabel: 'I. stupeň – lehká závislost do 18 let (3 potřeby)',
      monthlyAmountCzk: 4900,
      explanation: 'Dítě nezvládá 3 základní životní potřeby. Výše příspěvku činí 4 900 Kč měsíčně.',
    };
  }
  if (clamped <= 5) {
    return {
      degree: 2,
      degreeLabel: 'II. stupeň – středně těžká závislost do 18 let (4–5 potřeb)',
      monthlyAmountCzk: 8200,
      explanation: 'Dítě nezvládá 4 nebo 5 základních životních potřeb. Výše příspěvku činí 8 200 Kč měsíčně.',
    };
  }
  if (clamped <= 7) {
    return {
      degree: 3,
      degreeLabel: 'III. stupeň – těžká závislost do 18 let (6–7 potřeb)',
      monthlyAmountCzk: 16100,
      explanation: 'Dítě nezvládá 6 nebo 7 základních životních potřeb. Výše příspěvku činí 16 100 Kč měsíčně.',
    };
  }
  return {
    degree: 4,
    degreeLabel: isResidential
      ? 'IV. stupeň – úplná závislost do 18 let, pobytová služba (8–9 potřeb)'
      : 'IV. stupeň – úplná závislost do 18 let, doma (8–9 potřeb)',
    monthlyAmountCzk: isResidential ? 23000 : 27000,
    explanation: isResidential
      ? 'V celoroční pobytové službě činí IV. stupeň 23 000 Kč měsíčně.'
      : 'V domácím prostředí činí IV. stupeň 27 000 Kč měsíčně.',
  };
}

export interface HomeFeeCalculationResult {
  cappedRoomDailyCzk: number;
  cappedFoodDailyCzk: number;
  fullMonthlyCostCzk: number;
  mandatoryIncomeRemainderCzk: number;
  maxPayableFromIncomeCzk: number;
  actualMonthlyPaymentCzk: number;
  actualClientRemainderCzk: number;
  isReducedBy15PercentRule: boolean;
  careAllowanceToProviderCzk: number;
}

export function calculateHomeFee(
  daysInMonth: number,
  dailyRoomCzk: number,
  dailyFoodCzk: number,
  isSingleRoom: boolean,
  clientMonthlyPensionCzk: number,
  careAllowanceCzk: number
): HomeFeeCalculationResult {
  const safeDays = Math.max(28, Math.min(31, Math.round(daysInMonth)));
  const maxRoom = isSingleRoom
    ? CARE_LAW_2026_CONSTANTS.ROOM_MAX_SINGLE_CZK
    : CARE_LAW_2026_CONSTANTS.ROOM_MAX_SHARED_CZK;
  const cappedRoomDailyCzk = Math.max(0, Math.min(maxRoom, Math.round(dailyRoomCzk)));
  const cappedFoodDailyCzk = Math.max(
    0,
    Math.min(CARE_LAW_2026_CONSTANTS.FOOD_MAX_FULL_DAY_CZK, Math.round(dailyFoodCzk))
  );
  const fullMonthlyCostCzk = safeDays * (cappedRoomDailyCzk + cappedFoodDailyCzk);
  const safeIncome = Math.max(0, Math.round(clientMonthlyPensionCzk));

  // § 73 odst. 3 zákona č. 108/2006 Sb.: musí zůstat alespoň 15 % příjmu
  const mandatoryIncomeRemainderCzk = Math.ceil(
    safeIncome * CARE_LAW_2026_CONSTANTS.MIN_INCOME_REMAINDER_RATIO
  );
  const maxPayableFromIncomeCzk = Math.max(0, safeIncome - mandatoryIncomeRemainderCzk);
  const isReducedBy15PercentRule = fullMonthlyCostCzk > maxPayableFromIncomeCzk;
  const actualMonthlyPaymentCzk = Math.min(fullMonthlyCostCzk, maxPayableFromIncomeCzk);
  const actualClientRemainderCzk = safeIncome - actualMonthlyPaymentCzk;

  return {
    cappedRoomDailyCzk,
    cappedFoodDailyCzk,
    fullMonthlyCostCzk,
    mandatoryIncomeRemainderCzk,
    maxPayableFromIncomeCzk,
    actualMonthlyPaymentCzk,
    actualClientRemainderCzk,
    isReducedBy15PercentRule,
    careAllowanceToProviderCzk: Math.max(0, Math.round(careAllowanceCzk)),
  };
}

export interface NortonInput {
  physical: number;
  mental: number;
  activity: number;
  mobility: number;
  incontinence: number;
}

export interface NortonResult {
  totalScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskLabel: string;
  colorClass: string;
  guidanceForPss: string;
}

export function calculateNortonScore(input: NortonInput): NortonResult {
  const clamp = (val: number) => Math.max(1, Math.min(4, Math.round(val)));
  const totalScore =
    clamp(input.physical) +
    clamp(input.mental) +
    clamp(input.activity) +
    clamp(input.mobility) +
    clamp(input.incontinence);

  if (totalScore <= 12) {
    return {
      totalScore,
      riskLevel: 'high',
      riskLabel: 'Vysoké riziko vzniku dekubitů (≤ 12 bodů)',
      colorClass: 'rose',
      guidanceForPss:
        'Nutné okamžité zavedení přísného polohovacího režimu (každé 2 hod. ve dne, 3 hod. v noci), pasivní či aktivní antidekubitní matrace, šetrná hygiena a každodenní kontrola predilekčních míst. Každou změnu kůže ihned hlásit zdravotní sestře!',
    };
  }
  if (totalScore <= 14) {
    return {
      totalScore,
      riskLevel: 'medium',
      riskLabel: 'Zvýšené / hraniční riziko dekubitů (13–14 bodů)',
      colorClass: 'amber',
      guidanceForPss:
        'Zvýšený dohled při hygieně a oblékání, podpora aktivní chůze/mobilizace, polohování či odlehčení pat a sakra, hlídání příjmu bílkovin a tekutin. Při sebemenším zarudnutí informovat zdravotní sestru.',
    };
  }
  return {
    totalScore,
    riskLevel: 'low',
    riskLabel: 'Nízké riziko dekubitů (15–20 bodů)',
    colorClass: 'emerald',
    guidanceForPss:
      'Preventivní podpora soběstačnosti, podněcování k pohybu, suché a čisté lůžko bez záhybů, vyvážená strava a pitný režim. Nezapomeňte, že stav se může rychle zhoršit např. při horečce či infekci.',
  };
}

export function selectSmartFlashcards(
  cards: Flashcard[],
  cardBoxes: Record<string, number>,
  moduleFilter: ModuleId | 'all',
  onlyUnmastered: boolean
): Flashcard[] {
  const filtered = cards.filter((c) => {
    if (moduleFilter !== 'all' && c.moduleId !== moduleFilter) return false;
    const box = cardBoxes[c.id] ?? 0;
    if (onlyUnmastered && box >= 3) return false;
    return true;
  });

  // Sort by Leitner priority: 0 (unseen) and 1 (struggling) first, then 2, then 3
  const priorityOrder = (box: number) => {
    if (box === 1) return 0; // Need most practice
    if (box === 0) return 1; // Unseen
    if (box === 2) return 2;
    return 3;
  };

  return [...filtered].sort((a, b) => {
    const pa = priorityOrder(cardBoxes[a.id] ?? 0);
    const pb = priorityOrder(cardBoxes[b.id] ?? 0);
    return pa - pb;
  });
}

export function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateExamSet(questions: QuizQuestion[], count = 25): QuizQuestion[] {
  const byModule = new Map<ModuleId, QuizQuestion[]>();
  for (const q of questions) {
    const list = byModule.get(q.moduleId) ?? [];
    list.push(q);
    byModule.set(q.moduleId, list);
  }

  const selected: QuizQuestion[] = [];
  const usedIds = new Set<string>();
  const moduleKeys = Array.from(byModule.keys());

  // First ensure balanced representation across all modules (at least 3 per module if count >= 24)
  const perModuleBase = Math.max(1, Math.floor(count / Math.max(1, moduleKeys.length)));
  for (const mod of moduleKeys) {
    const pool = shuffleArray(byModule.get(mod) ?? []);
    for (const q of pool.slice(0, perModuleBase)) {
      if (selected.length < count) {
        selected.push(q);
        usedIds.add(q.id);
      }
    }
  }

  // Fill remaining slots from unused questions
  if (selected.length < count) {
    const remaining = shuffleArray(questions.filter((q) => !usedIds.has(q.id)));
    for (const q of remaining) {
      if (selected.length >= count) break;
      selected.push(q);
      usedIds.add(q.id);
    }
  }

  return shuffleArray(selected);
}

export function formatTimeMMSS(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function getDaysUntilExam(
  examDate: string | null,
  todayDateStr?: string
): number | null {
  if (!examDate || !/^\d{4}-\d{2}-\d{2}$/.test(examDate)) return null;
  const now = new Date();
  const baseTodayStr =
    todayDateStr ??
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`;
  const target = new Date(`${examDate}T00:00:00`);
  const today = new Date(`${baseTodayStr}T00:00:00`);
  if (Number.isNaN(target.getTime()) || Number.isNaN(today.getTime())) return null;
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export interface StudyRecommendation {
  title: string;
  description: string;
  actionLabel: string;
  actionType: 'mistakes' | 'module' | 'flashcards' | 'exam' | 'scenarios';
  moduleId?: ModuleId;
}

export function getRecommendedNextAction(
  progress: UserProgress,
  modules: StudyModule[],
  flashcards: Flashcard[],
  questions: QuizQuestion[],
  scenarios: CaseScenario[]
): StudyRecommendation {
  if (progress.mistakeQuestionIds.length > 0) {
    return {
      title: `Oprav si ${progress.mistakeQuestionIds.length} ${
        progress.mistakeQuestionIds.length === 1
          ? 'otázku v Chybovníku'
          : progress.mistakeQuestionIds.length < 5
          ? 'otázky v Chybovníku'
          : 'otázek v Chybovníku'
      }`,
      description:
        'Nejrychlejší cesta ke zlepšení skóre: zopakuj si přesně otázky, kde jsi minule zaváhala.',
      actionLabel: 'Opravit chyby',
      actionType: 'mistakes',
    };
  }

  let weakestMod = modules[0];
  let lowestScore = Number.POSITIVE_INFINITY;

  for (const mod of modules) {
    const modDone = progress.completedModules.includes(mod.id) ? 1 : 0;
    const modCards = flashcards.filter((c) => c.moduleId === mod.id);
    const modMastered =
      modCards.length > 0
        ? modCards.filter((c) => (progress.cardBoxes[c.id] ?? 0) >= 2).length / modCards.length
        : 1;
    const modQs = questions.filter((q) => q.moduleId === mod.id);
    const modCorrect =
      modQs.length > 0
        ? modQs.filter((q) => progress.answeredQuestions[q.id] === true).length / modQs.length
        : 1;
    const score = modDone * 0.35 + modMastered * 0.3 + modCorrect * 0.35;
    if (score < lowestScore) {
      lowestScore = score;
      weakestMod = mod;
    }
  }

  if (weakestMod && lowestScore < 0.75) {
    return {
      title: `Posilni okruh ${weakestMod.order}: ${weakestMod.shortTitle}`,
      description:
        'Tento okruh máš zatím nejméně procvičený. Projdi si klíčové body a otestuj se v kvízu.',
      actionLabel: 'Studovat tento okruh',
      actionType: 'module',
      moduleId: weakestMod.id,
    };
  }

  const unmasteredCards = flashcards.filter((c) => (progress.cardBoxes[c.id] ?? 0) < 2).length;
  if (unmasteredCards > 0) {
    return {
      title: `Upevni si paměť u ${unmasteredCards} kartiček`,
      description:
        'Okruhy už znáš skvěle – krátká série kartiček ti pojistí paragrafy a čísla do dlouhodobé paměti.',
      actionLabel: 'Spustit kartičky',
      actionType: 'flashcards',
    };
  }

  const solvedScenarios = scenarios.filter((s) => progress.completedScenarios[s.id]).length;
  if (solvedScenarios < scenarios.length || progress.oralTicketsSolved < 2) {
    return {
      title: 'Vyzkoušej si losování k ústní zkoušce před komisí',
      description:
        'Máš natrénováno na testy – teď si vylosuj zkušební lístek a zkus odpovědět nahlas jako naostro.',
      actionLabel: 'Vylosovat otázku',
      actionType: 'scenarios',
    };
  }

  return {
    title: 'Jsi skvěle připravená! Dej si generálku Zkouškou nanečisto',
    description:
      'Projdi si 25 otázek s 30minutovým časovačem napříč všemi 8 okruhy a ověř si jistotu nad 75 %.',
    actionLabel: 'Spustit Zkoušku nanečisto',
    actionType: 'exam',
  };
}

export interface OralExamTicket {
  module: StudyModule;
  scenario: CaseScenario;
}

export function drawOralExamTicket(
  modules: StudyModule[],
  scenarios: CaseScenario[],
  excludeModuleId?: ModuleId,
  excludeScenarioId?: string
): OralExamTicket {
  const modPool =
    excludeModuleId && modules.length > 1
      ? modules.filter((m) => m.id !== excludeModuleId)
      : modules;
  const mod = modPool[Math.floor(Math.random() * modPool.length)] ?? modules[0];

  const scenPool =
    excludeScenarioId && scenarios.length > 1
      ? scenarios.filter((s) => s.id !== excludeScenarioId)
      : scenarios;
  const scenario = scenPool[Math.floor(Math.random() * scenPool.length)] ?? scenarios[0];

  return { module: mod, scenario };
}


/**
 * Very small Czech vocative helper for first names in the greeting ("Jana" → "Jano", "Petra" → "Petro").
 * Only handles the safe, common ending -a; anything else (Lucie, Terko, Tomáš…) is left unchanged.
 */
export function toCzechVocative(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length < 3 || /\s/.test(trimmed)) return trimmed;
  if (/[^aeiouyáéíóúůý]a$/i.test(trimmed)) {
    return trimmed.slice(0, -1) + (trimmed.endsWith('A') ? 'O' : 'o');
  }
  return trimmed;
}