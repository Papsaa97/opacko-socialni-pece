import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Dices,
  HeartHandshake,
  Lightbulb,
  MessageSquareQuote,
  NotebookPen,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  XCircle,
} from 'lucide-react';
import type { ModuleId, UserProgress } from '../types/study';
import { CASE_SCENARIOS, STUDY_MODULES } from '../data';
import { drawOralExamTicket, formatTimeMMSS, type OralExamTicket } from '../utils/studyLogic';

interface ScenariosViewProps {
  progress: UserProgress;
  onRecordScenario: (scenarioId: string, isBestChoice: boolean) => void;
  onIncrementOralTicket?: () => void;
  onUpdateStudyNotes?: (notes: string) => void;
}

const ORAL_PREP_SECONDS = 10 * 60;

export const ScenariosView: React.FC<ScenariosViewProps> = ({
  progress,
  onRecordScenario,
  onIncrementOralTicket,
  onUpdateStudyNotes,
}) => {
  const [viewMode, setViewMode] = useState<'browse' | 'oral'>('browse');
  const [filterModule, setFilterModule] = useState<ModuleId | 'all'>('all');
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});
  const [openOralGuide, setOpenOralGuide] = useState<Record<string, boolean>>({});

  // Oral exam ticket simulator state
  const [ticket, setTicket] = useState<OralExamTicket>(() =>
    drawOralExamTicket(STUDY_MODULES, CASE_SCENARIOS)
  );
  const [prepSecondsLeft, setPrepSecondsLeft] = useState(ORAL_PREP_SECONDS);
  const [prepRunning, setPrepRunning] = useState(false);
  const [revealCommissionAnswer, setRevealCommissionAnswer] = useState(false);
  const [ticketCounted, setTicketCounted] = useState(false);

  useEffect(() => {
    if (!prepRunning || viewMode !== 'oral') return;
    const id = window.setInterval(() => {
      setPrepSecondsLeft((prev) => {
        if (prev <= 1) {
          setPrepRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [prepRunning, viewMode]);

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

  const handleDrawNewTicket = () => {
    const next = drawOralExamTicket(
      STUDY_MODULES,
      CASE_SCENARIOS,
      ticket.module.id,
      ticket.scenario.id
    );
    setTicket(next);
    setPrepSecondsLeft(ORAL_PREP_SECONDS);
    setPrepRunning(false);
    setRevealCommissionAnswer(false);
    setTicketCounted(false);
  };

  const handleMarkTicketSolved = () => {
    if (ticketCounted) return;
    setTicketCounted(true);
    setPrepRunning(false);
    onIncrementOralTicket?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Modelové situace k ústní zkoušce
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Reálné situace z domova pro seniory i simulátor losování zkušební otázky před komisí.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-xs font-bold text-emerald-800 dark:text-emerald-200">
            Situace: {solvedCount}/{CASE_SCENARIOS.length}
          </div>
          {progress.oralTicketsSolved > 0 && (
            <div className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-xs font-bold text-amber-800 dark:text-amber-200">
              Ústní lístky: {progress.oralTicketsSolved}
            </div>
          )}
        </div>
      </div>

      {/* Mode Switch */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setViewMode('browse')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
            viewMode === 'browse'
              ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-400'
          }`}
        >
          <HeartHandshake className="w-5 h-5 shrink-0" />
          <div>
            <div className="text-sm font-bold">Procházet všech {CASE_SCENARIOS.length} situací</div>
            <div className={`text-xs ${viewMode === 'browse' ? 'text-teal-100' : 'text-slate-500'}`}>
              Řešení jednotlivých kazuistik s okamžitým vysvětlením
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('oral')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
            viewMode === 'oral'
              ? 'bg-amber-600 border-amber-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400'
          }`}
        >
          <Dices className="w-5 h-5 shrink-0" />
          <div>
            <div className="text-sm font-bold">Trenažér ústní zkoušky (Losování)</div>
            <div className={`text-xs ${viewMode === 'oral' ? 'text-amber-100' : 'text-slate-500'}`}>
              Náhodný okruh + situace, potítko a kontrola před komisí
            </div>
          </div>
        </button>
      </div>

      {/* ORAL EXAM SIMULATOR */}
      {viewMode === 'oral' && (
        <div className="space-y-5">
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/60 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-xs font-bold mb-1.5">
                  <Dices className="w-3.5 h-3.5" /> Vylosovaný zkušební lístek
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  Okruh {ticket.module.order}: {ticket.module.title} + Situace: {ticket.scenario.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Potítko: {formatTimeMMSS(prepSecondsLeft)}</span>
                  <button
                    type="button"
                    onClick={() => setPrepRunning((r) => !r)}
                    className="ml-1 p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                    aria-label={prepRunning ? 'Pozastavit potítko' : 'Spustit potítko'}
                  >
                    {prepRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPrepRunning(false);
                      setPrepSecondsLeft(ORAL_PREP_SECONDS);
                    }}
                    className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                    aria-label="Resetovat časovač potítka"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleDrawNewTicket}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer"
                >
                  <Dices className="w-4 h-4" />
                  Vylosovat jinou otázku
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Part A: Theoretical Module */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  Část A · Teoretický okruh ({ticket.module.badgeText})
                </div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {ticket.module.title}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {ticket.module.overview}
                </p>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 pt-1">
                  Podkapitoly, o kterých mluvit:
                </div>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  {ticket.module.sections.map((s) => (
                    <li key={s.id} className="flex items-start gap-1.5">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>{s.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Part B: Practical Scenario */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Část B · Praktická situace z domova pro seniory
                </div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {ticket.scenario.title}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  <strong>Klient:</strong> {ticket.scenario.clientProfile}
                </p>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  {ticket.scenario.situation}
                </p>
              </div>
            </div>

            {/* Personal Scratchpad */}
            <div className="space-y-2">
              <label
                htmlFor="oral-scratchpad"
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                <NotebookPen className="w-4 h-4 text-teal-600" />
                Moje poznámky z potítka (ukládá se automaticky)
              </label>
              <textarea
                id="oral-scratchpad"
                rows={3}
                value={progress.studyNotes}
                onChange={(e) => onUpdateStudyNotes?.(e.target.value)}
                placeholder="Sepište si v bodech osnovu odpovědi (např. paragraf, hranice kompetencí, koho hned informovat, zásada péče)…"
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-sm outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => setRevealCommissionAnswer((v) => !v)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold cursor-pointer"
              >
                <MessageSquareQuote className="w-4 h-4" />
                {revealCommissionAnswer
                  ? 'Skrýt vzorovou odpověď komise'
                  : 'Odkrýt, co chce slyšet komise'}
              </button>

              <button
                type="button"
                onClick={handleMarkTicketSolved}
                disabled={ticketCounted}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer disabled:cursor-default ${
                  ticketCounted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <Award className="w-4 h-4" />
                {ticketCounted ? 'Lístek zvládnut ✓' : 'Umím – započítat lístek'}
              </button>
            </div>

            {revealCommissionAnswer && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4" /> Co chce komise slyšet k okruhu & chytáky
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-emerald-950 dark:text-emerald-100">
                    {ticket.module.examTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-bold text-emerald-600">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                  {ticket.module.examTraps[0] && (
                    <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-1.5">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                      <span>
                        <strong>Pozor na chyták:</strong> {ticket.module.examTraps[0].trap}
                        <br />
                        <strong>Správně:</strong> {ticket.module.examTraps[0].truth}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                    Vzorová struktura odpovědi k situaci:
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                    {ticket.scenario.oralExamModelAnswer.map((line, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-bold text-amber-600">{i + 1}.</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-xs font-semibold text-teal-800 dark:text-teal-300 pt-1">
                    Hlavní zásada: {ticket.scenario.keyTakeaway}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BROWSE ALL SCENARIOS MODE */}
      {viewMode === 'browse' && (
        <>
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
                    {scenario.choices.map((choice, choiceIndex) => {
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
                            {String.fromCharCode(65 + choiceIndex)}
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
                        {chosenObj.isBest
                          ? '✓ Výborná volba v přímé péči'
                          : '✗ Pozor na tento postup'}
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
        </>
      )}
    </div>
  );
};
