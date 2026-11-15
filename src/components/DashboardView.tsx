import React from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Flame,
  HeartHandshake,
  Layers,
  ShieldAlert,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import type { ModuleId, NavViewId, UserProgress } from '../types/study';
import { CASE_SCENARIOS, FLASHCARDS, QUIZ_QUESTIONS, STUDY_MODULES } from '../data';

interface DashboardViewProps {
  progress: UserProgress;
  onNavigate: (view: NavViewId, moduleId?: ModuleId) => void;
  onStartQuickQuiz: (mode: 'quick10' | 'exam' | 'mistakes') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  progress,
  onNavigate,
  onStartQuickQuiz,
}) => {
  const masteredCards = FLASHCARDS.filter((c) => (progress.cardBoxes[c.id] ?? 0) >= 2).length;
  const correctQuestions = QUIZ_QUESTIONS.filter((q) => progress.answeredQuestions[q.id] === true).length;
  const solvedScenarios = CASE_SCENARIOS.filter((s) => progress.completedScenarios[s.id]).length;
  const completedModCount = progress.completedModules.length;

  const totalWeights =
    (completedModCount / STUDY_MODULES.length) * 0.25 +
    (masteredCards / FLASHCARDS.length) * 0.25 +
    (correctQuestions / QUIZ_QUESTIONS.length) * 0.35 +
    (solvedScenarios / CASE_SCENARIOS.length) * 0.15;
  const readinessPct = Math.round(totalWeights * 100);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-900 text-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-teal-50 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Kurz Pracovník v sociálních službách (§ 116) · Domov pro seniory
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ahoj! Dáme opáčko ke zkoušce v klidu a přehledně.
            </h2>
            <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
              Všechny klíčové paragrafy zákona č. 108/2006 Sb., aktuální částky pro rok 2026,
              ošetřovatelské základy, polohování, validaci i první pomoc na jednom místě. Funguje i
              offline v mobilu.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-5 min-w-[230px]">
            <div className="flex items-center justify-between text-xs font-medium text-teal-100 mb-1.5">
              <span>Připravenost ke zkoušce</span>
              <span className="font-bold text-white text-base">{readinessPct} %</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/20 overflow-hidden mb-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 to-emerald-300 transition-all duration-500"
                style={{ width: `${Math.max(4, readinessPct)}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-teal-50">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                <span>{completedModCount}/{STUDY_MODULES.length} okruhů</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-300" />
                <span>{masteredCards}/{FLASHCARDS.length} kartiček</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ClipboardCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>{correctQuestions}/{QUIZ_QUESTIONS.length} otázek</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>Série: {progress.streakDays} d.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Cards */}
      <section aria-label="Rychlé akce">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Jak chcete začít dnešní opáčko?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <button
            type="button"
            onClick={() => onStartQuickQuiz('quick10')}
            className="text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 shadow-xs hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
              Rychlá 10min dávka
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              10 chytrých testových otázek napříč okruhy s okamžitým vysvětlením.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onStartQuickQuiz('exam')}
            className="text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 shadow-xs hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
              Zkouška nanečisto
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              25 otázek ze všech 8 okruhů, časovač 30 minut, hranice úspěchu 75 %.
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              progress.mistakeQuestionIds.length > 0
                ? onStartQuickQuiz('mistakes')
                : onNavigate('flashcards')
            }
            className="text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-600 shadow-xs hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 flex items-center justify-center mb-3">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>
                Chybovník{' '}
                {progress.mistakeQuestionIds.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-200">
                    {progress.mistakeQuestionIds.length}
                  </span>
                )}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {progress.mistakeQuestionIds.length > 0
                ? 'Opravte si přesně ty otázky, ve kterých jste minule zaváhala.'
                : 'Zatím bez chyb! Otevřete opakovací kartičky pro upevnění paměti.'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('scenarios')}
            className="text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 shadow-xs hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
              Modelové situace
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              12 praktických případů z domova pro seniory včetně osnovy k ústní zkoušce.
            </p>
          </button>
        </div>
      </section>

      {/* Special Interactive Tools Banner */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onNavigate('tools')}
          className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200/80 dark:border-amber-900/60 hover:shadow-md transition-all text-left cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-slate-900 dark:text-white">
              Interaktivní mapa dekubitů, Nortonová & Kalkulačka 2026
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Klikací lidské tělo v různých polohách + výpočet stupně závislosti a 15 % zůstatku.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-700 dark:text-amber-300 shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('cheatsheet')}
          className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/40 dark:to-cyan-950/30 border border-teal-200/80 dark:border-teal-900/60 hover:shadow-md transition-all text-left cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-slate-900 dark:text-white">
              Tisknutelný tahák ke zkoušce (A4 / PDF)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Všechna čísla 2026, 15 standardů, KPR 30:2, FAST, § 89 a chytáky na pár stranách.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-teal-700 dark:text-teal-300 shrink-0" />
        </button>
      </section>

      {/* 8 Study Modules Grid */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Všech 8 studijních okruhů kurzu
          </h3>
          <button
            type="button"
            onClick={() => onNavigate('modules')}
            className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
          >
            Otevřít studovnu →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {STUDY_MODULES.map((mod) => {
            const isDone = progress.completedModules.includes(mod.id);
            const modCards = FLASHCARDS.filter((c) => c.moduleId === mod.id);
            const modMastered = modCards.filter((c) => (progress.cardBoxes[c.id] ?? 0) >= 2).length;
            const modQuestions = QUIZ_QUESTIONS.filter((q) => q.moduleId === mod.id);
            const modCorrect = modQuestions.filter(
              (q) => progress.answeredQuestions[q.id] === true
            ).length;

            return (
              <div
                key={mod.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-1.5">
                      {mod.badgeText} · cca {mod.estimatedMinutes} min
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white leading-snug">
                      {mod.title}
                    </h4>
                  </div>
                  {isDone && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold shrink-0"
                      title="Okruh označen jako prostudovaný"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Hotovo
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">{mod.subtitle}</p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3">
                    <span>
                      Kartičky: <strong>{modMastered}/{modCards.length}</strong>
                    </span>
                    <span>
                      Test: <strong>{modCorrect}/{modQuestions.length}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate('modules', mod.id)}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Studovat
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('quiz', mod.id)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Test
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Exam History */}
      {progress.examHistory.length > 0 && (
        <section className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Poslední pokusy Zkoušky nanečisto
          </h3>
          <div className="space-y-2">
            {progress.examHistory.slice(0, 5).map((attempt) => {
              const pct = Math.round((attempt.score / attempt.total) * 100);
              return (
                <div
                  key={attempt.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        attempt.passed
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {attempt.passed ? 'SPLNĚNO' : 'OPAKOVAT'}
                    </span>
                    <span className="font-semibold">
                      {attempt.score} / {attempt.total} ({pct} %)
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(attempt.dateIso).toLocaleDateString('cs-CZ')} ·{' '}
                    {Math.floor(attempt.durationSeconds / 60)} min {attempt.durationSeconds % 60} s
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
