import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Layers,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import type { ModuleId, NavViewId, UserProgress } from '../types/study';
import { FLASHCARDS, QUIZ_QUESTIONS, STUDY_MODULES } from '../data';

interface ModulesViewProps {
  selectedModuleId: ModuleId;
  focusedSectionId?: string | null;
  onSelectModule: (moduleId: ModuleId) => void;
  progress: UserProgress;
  onToggleModuleCompleted: (moduleId: ModuleId) => void;
  onNavigate: (view: NavViewId, moduleId?: ModuleId) => void;
}

export const ModulesView: React.FC<ModulesViewProps> = ({
  selectedModuleId,
  focusedSectionId = null,
  onSelectModule,
  progress,
  onToggleModuleCompleted,
  onNavigate,
}) => {
  const currentIdx = Math.max(
    0,
    STUDY_MODULES.findIndex((m) => m.id === selectedModuleId)
  );
  const currentModule = STUDY_MODULES[currentIdx] ?? STUDY_MODULES[0];
  const prevModule = currentIdx > 0 ? STUDY_MODULES[currentIdx - 1] : null;
  const nextModule =
    currentIdx + 1 < STUDY_MODULES.length ? STUDY_MODULES[currentIdx + 1] : null;

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    currentModule.sections.forEach((sec, idx) => {
      initial[sec.id] = focusedSectionId ? sec.id === focusedSectionId : idx < 2;
    });
    if (
      focusedSectionId &&
      !currentModule.sections.some((sec) => sec.id === focusedSectionId)
    ) {
      currentModule.sections.forEach((sec, idx) => {
        initial[sec.id] = idx < 2;
      });
    }
    setOpenSections(initial);

    // Bring the right place into view: the focused chapter (from search) or the top of the new okruh.
    const timer = window.setTimeout(() => {
      try {
        const target = focusedSectionId
          ? document.getElementById(`section-${focusedSectionId}`)
          : null;
        if (target && typeof target.scrollIntoView === 'function') {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (typeof window.scrollTo === 'function') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch {
        // jsdom / old browsers without smooth scrolling
      }
    }, 60);
    return () => window.clearTimeout(timer);
  }, [currentModule, focusedSectionId]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allExpanded =
    currentModule.sections.length > 0 &&
    currentModule.sections.every((s) => Boolean(openSections[s.id]));

  const toggleExpandAll = () => {
    const nextValue = !allExpanded;
    const next: Record<string, boolean> = {};
    currentModule.sections.forEach((s) => {
      next[s.id] = nextValue;
    });
    setOpenSections(next);
  };

  const moduleStats = useMemo(() => {
    const modCards = FLASHCARDS.filter((c) => c.moduleId === currentModule.id);
    const modMastered = modCards.filter((c) => (progress.cardBoxes[c.id] ?? 0) >= 2).length;
    const modQuestions = QUIZ_QUESTIONS.filter((q) => q.moduleId === currentModule.id);
    const modCorrect = modQuestions.filter(
      (q) => progress.answeredQuestions[q.id] === true
    ).length;
    return {
      cardsTotal: modCards.length,
      cardsMastered: modMastered,
      questionsTotal: modQuestions.length,
      questionsCorrect: modCorrect,
    };
  }, [currentModule.id, progress.answeredQuestions, progress.cardBoxes]);

  const isCompleted = progress.completedModules.includes(currentModule.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Studijní okruhy kurzu
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Přehledně zpracovaná látka pro přímou obslužnou péči v domově pro seniory.
          </p>
        </div>
        <button
          type="button"
          onClick={toggleExpandAll}
          className="self-start px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
        >
          {allExpanded ? 'Sbalit všechny kapitoly' : 'Rozbalit všechny kapitoly'}
        </button>
      </div>

      {/* Horizontal / Grid Module Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {STUDY_MODULES.map((mod) => {
          const active = mod.id === currentModule.id;
          const done = progress.completedModules.includes(mod.id);
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => onSelectModule(mod.id)}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer relative ${
                active
                  ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span
                  className={`text-[11px] font-bold ${
                    active ? 'text-teal-100' : 'text-teal-700 dark:text-teal-400'
                  }`}
                >
                  Okruh {mod.order}
                </span>
                {done && (
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      active ? 'text-amber-300' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  />
                )}
              </div>
              <div className="text-xs font-semibold leading-tight line-clamp-2">
                {mod.shortTitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Module Header Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300">
                <BookOpen className="w-3.5 h-3.5" />
                {currentModule.badgeText} · cca {currentModule.estimatedMinutes} min studia
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Kartičky: <strong>{moduleStats.cardsMastered}/{moduleStats.cardsTotal}</strong> ·
                Test: <strong>{moduleStats.questionsCorrect}/{moduleStats.questionsTotal}</strong>
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {currentModule.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentModule.overview}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onToggleModuleCompleted(currentModule.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              isCompleted
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isCompleted ? 'Okruh prostudován ✓' : 'Označit jako prostudované'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onNavigate('flashcards', currentModule.id)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            Procvičit kartičky z tohoto okruhu
          </button>
          <button
            type="button"
            onClick={() => onNavigate('quiz', currentModule.id)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <ClipboardCheck className="w-4 h-4" />
            Spustit test z tohoto okruhu
          </button>
        </div>
      </div>

      {/* Sections Accordion */}
      <div className="space-y-3">
        {currentModule.sections.map((section) => {
          const isOpen = Boolean(openSections[section.id]);
          const isHighlighted = focusedSectionId === section.id;
          return (
            <div
              key={section.id}
              id={`section-${section.id}`}
              className={`scroll-mt-20 rounded-2xl bg-white dark:bg-slate-900 border overflow-hidden transition-colors ${
                isHighlighted
                  ? 'border-teal-500 ring-2 ring-teal-500/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {section.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    {section.summary}
                  </p>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <ul className="space-y-2.5">
                    {section.keyPoints.map((point, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200 leading-relaxed"
                      >
                        <span className="w-2 h-2 rounded-full bg-teal-500 mt-2 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {section.table && (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                      <table className="w-full text-xs sm:text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold">
                          <tr>
                            {section.table.headers.map((h) => (
                              <th
                                key={h}
                                className="px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-700"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table.rows.map((row, rIdx) => (
                            <tr
                              key={rIdx}
                              className="border-b last:border-b-0 border-slate-100 dark:border-slate-800"
                            >
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className={`px-3.5 py-2.5 ${
                                    cIdx === 0
                                      ? 'font-semibold text-slate-900 dark:text-white'
                                      : 'text-slate-600 dark:text-slate-300'
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {section.practicalTip && (
                    <div className="p-3.5 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/70 dark:border-teal-900/60 flex items-start gap-2.5 text-xs sm:text-sm text-teal-900 dark:text-teal-100">
                      <Lightbulb className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold">Tip z praxe: </strong>
                        {section.practicalTip}
                      </div>
                    </div>
                  )}

                  {section.mnemonic && (
                    <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/60 flex items-start gap-2.5 text-xs sm:text-sm text-amber-900 dark:text-amber-100">
                      <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold">Paměťová pomůcka: </strong>
                        {section.mnemonic}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Exam Tips & Traps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-3">
          <h4 className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Co chtějí slyšet u ústní zkoušky
          </h4>
          <ul className="space-y-2 text-sm text-emerald-950 dark:text-emerald-100">
            {currentModule.examTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-3">
          <h4 className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            Pozor – časté zkouškové chytáky!
          </h4>
          <div className="space-y-3">
            {currentModule.examTraps.map((item, i) => (
              <div key={i} className="text-sm space-y-1">
                <div className="font-semibold text-rose-900 dark:text-rose-200">
                  Mýtus: {item.trap}
                </div>
                <div className="text-slate-700 dark:text-slate-300">
                  <strong className="text-emerald-700 dark:text-emerald-400">Správně:</strong>{' '}
                  {item.truth}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sequential Chapter Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
        {prevModule ? (
          <button
            type="button"
            onClick={() => onSelectModule(prevModule.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Okruh {prevModule.order}: {prevModule.shortTitle}
          </button>
        ) : (
          <span />
        )}

        {nextModule && (
          <button
            type="button"
            onClick={() => onSelectModule(nextModule.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold cursor-pointer ml-auto"
          >
            Další okruh ({nextModule.order}. {nextModule.shortTitle})
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
