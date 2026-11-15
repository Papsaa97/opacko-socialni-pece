import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HeartHandshake,
  MessageSquareQuote,
  Sparkles,
  XCircle,
} from 'lucide-react';
import type { ModuleId, UserProgress } from '../types/study';
import { CASE_SCENARIOS, STUDY_MODULES } from '../data';

interface ScenariosViewProps {
  progress: UserProgress;
  onRecordScenario: (scenarioId: string, isBestChoice: boolean) => void;
}

export const ScenariosView: React.FC<ScenariosViewProps> = ({
  progress,
  onRecordScenario,
}) => {
  const [filterModule, setFilterModule] = useState<ModuleId | 'all'>('all');
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});
  const [openOralGuide, setOpenOralGuide] = useState<Record<string, boolean>>({});

  const visibleScenarios = useMemo(() => {
    if (filterModule === 'all') return CASE_SCENARIOS;
    return CASE_SCENARIOS.filter((s) => s.moduleId === filterModule);
  }, [filterModule]);

  const moduleMap = useMemo(
    () => new Map(STUDY_MODULES.map((m) => [m.id, m.shortTitle])),
    []
  );

  const solvedCount = CASE_SCENARIOS.filter((s) => progress.completedScenarios[s.id]).length;

  const handleChoose = (scenarioId: string, choiceId: string, isBest: boolean) => {
    setSelectedChoices((prev) => ({ ...prev, [scenarioId]: choiceId }));
    onRecordScenario(scenarioId, isBest);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Modelové situace k ústní zkoušce
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Reálné situace z domova pro seniory. Vyberte nejvhodnější postup a podívejte se, jak
            odpovědět zkušební komisi.
          </p>
        </div>
        <div className="self-start px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-xs font-bold text-emerald-800 dark:text-emerald-200">
          Vyřešeno: {solvedCount} / {CASE_SCENARIOS.length}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilterModule('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
            filterModule === 'all'
              ? 'bg-teal-600 border-teal-600 text-white'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          Všechny situace ({CASE_SCENARIOS.length})
        </button>
        {STUDY_MODULES.filter((m) =>
          CASE_SCENARIOS.some((s) => s.moduleId === m.id)
        ).map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setFilterModule(m.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
              filterModule === m.id
                ? 'bg-teal-600 border-teal-600 text-white'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {m.shortTitle}
          </button>
        ))}
      </div>

      {/* Scenario Cards */}
      <div className="space-y-5">
        {visibleScenarios.map((scenario, idx) => {
          const chosenId = selectedChoices[scenario.id];
          const chosenObj = scenario.choices.find((c) => c.id === chosenId);
          const isSolvedBefore = progress.completedScenarios[scenario.id];
          const oralOpen = Boolean(openOralGuide[scenario.id]);

          return (
            <article
              key={scenario.id}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  Situace {idx + 1} · {moduleMap.get(scenario.moduleId)}
                </span>
                {isSolvedBefore && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Správně vyřešeno
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {scenario.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                  <strong>Klient:</strong> {scenario.clientProfile}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {scenario.situation}
              </div>

              {/* Choices */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Jak se zachováte?
                </div>
                {scenario.choices.map((choice) => {
                  const isSelected = chosenId === choice.id;
                  let btnStyle =
                    'border-slate-200 dark:border-slate-700 hover:border-teal-400 hover:bg-teal-50/30 dark:hover:bg-slate-800/70';

                  if (chosenId) {
                    if (isSelected && choice.isBest) {
                      btnStyle =
                        'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-100';
                    } else if (isSelected && !choice.isBest) {
                      btnStyle =
                        'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-950 dark:text-rose-100';
                    } else if (choice.isBest) {
                      btnStyle =
                        'border-emerald-400/70 bg-emerald-50/40 dark:bg-emerald-950/20';
                    }
                  }

                  return (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => handleChoose(scenario.id, choice.id, choice.isBest)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 uppercase">
                        {choice.id}
                      </span>
                      <span className="flex-1">{choice.text}</span>
                      {chosenId && choice.isBest && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {isSelected && !choice.isBest && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {chosenObj && (
                <div
                  className={`p-4 rounded-2xl border text-sm space-y-2 ${
                    chosenObj.isBest
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-100'
                  }`}
                >
                  <div className="font-bold">
                    {chosenObj.isBest ? '✓ Výborná volba v přímé péči' : '✗ Pozor na tento postup'}
                  </div>
                  <p className="leading-relaxed">{chosenObj.feedback}</p>
                  <div className="pt-1 text-xs font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Hlavní zásada: {scenario.keyTakeaway}</span>
                  </div>
                </div>
              )}

              {/* Expandable Oral Exam Guide */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() =>
                    setOpenOralGuide((prev) => ({
                      ...prev,
                      [scenario.id]: !prev[scenario.id],
                    }))
                  }
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                >
                  <MessageSquareQuote className="w-4 h-4" />
                  Jak odpovědět u ústní zkoušky
                  {oralOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {oralOpen && (
                  <div className="mt-3 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                      Doporučená struktura odpovědi před komisí:
                    </div>
                    <ul className="space-y-1.5 text-sm text-slate-800 dark:text-slate-200">
                      {scenario.oralExamModelAnswer.map((line, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="font-bold text-amber-600">{i + 1}.</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
