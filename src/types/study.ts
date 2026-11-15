export type ModuleId =
  | 'legislativa'
  | 'standardy-prava'
  | 'prima-pece'
  | 'mobilita-dekubity'
  | 'komunikace-demence'
  | 'aktivizace-paliativa'
  | 'narocne-situace'
  | 'prvni-pomoc';

export type NavViewId =
  | 'dashboard'
  | 'modules'
  | 'flashcards'
  | 'quiz'
  | 'scenarios'
  | 'tools'
  | 'glossary'
  | 'cheatsheet';

export interface StudySection {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  practicalTip?: string;
  mnemonic?: string;
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface ExamTrap {
  trap: string;
  truth: string;
}

export interface StudyModule {
  id: ModuleId;
  order: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  estimatedMinutes: number;
  accentColor: string;
  badgeText: string;
  overview: string;
  sections: StudySection[];
  examTips: string[];
  examTraps: ExamTrap[];
}

export interface Flashcard {
  id: string;
  moduleId: ModuleId;
  question: string;
  answer: string;
  mnemonic?: string;
  tags: string[];
}

export interface QuizQuestion {
  id: string;
  moduleId: ModuleId;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  legalOrClinicalRef?: string;
}

export interface ScenarioChoice {
  id: string;
  text: string;
  isBest: boolean;
  feedback: string;
  scoreDelta: number;
}

export interface CaseScenario {
  id: string;
  moduleId: ModuleId;
  title: string;
  clientProfile: string;
  situation: string;
  choices: ScenarioChoice[];
  oralExamModelAnswer: string[];
  keyTakeaway: string;
}

export type GlossaryCategory =
  | 'Legislativa'
  | 'Ošetřovatelství'
  | 'Psychologie a demence'
  | 'Komunikace a aktivizace'
  | 'První pomoc a hygiena';

export interface GlossaryTerm {
  id: string;
  term: string;
  category: GlossaryCategory;
  definition: string;
  practicalTip: string;
}

export interface ExamAttempt {
  id: string;
  dateIso: string;
  score: number;
  total: number;
  passed: boolean;
  durationSeconds: number;
  byModule: Partial<Record<ModuleId, { correct: number; total: number }>>;
}

export type CardBoxLevel = 0 | 1 | 2 | 3;

export interface UserProgress {
  userName: string;
  examDate: string | null;
  studyNotes: string;
  oralTicketsSolved: number;
  cardBoxes: Record<string, CardBoxLevel>;
  completedModules: ModuleId[];
  answeredQuestions: Record<string, boolean>;
  mistakeQuestionIds: string[];
  completedScenarios: Record<string, boolean>;
  examHistory: ExamAttempt[];
  lastStudyDate: string | null;
  streakDays: number;
  theme: 'light' | 'dark';
}
