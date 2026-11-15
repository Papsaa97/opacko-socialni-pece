import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertCircle,
  Brain,
  Calculator,
  Heart,
  HeartPulse,
  PhoneCall,
  Play,
  ShieldCheck,
  Square,
  UserCheck,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  COMPETENCY_MATRIX,
  DECUBITUS_HOTSPOTS,
  DECUBITUS_STAGES,
  TEN_BASIC_LIFE_NEEDS,
  VITAL_SIGNS_REFERENCE,
} from '../data';
import {
  calculateCareAllowance,
  calculateHomeFee,
  calculateNortonScore,
} from '../utils/studyLogic';

type ToolTab = 'decubitus' | 'calculator' | 'vitals' | 'firstaid';

const DEMENTIA_DELIRIUM_DEPRESSION = [
  {
    feature: 'Nástup a příčina',
    dementia: 'Plíživý, měsíce až roky (Alzheimerova nemoc, vaskulární).',
    delirium: 'Náhlý – hodiny až dny! Tělesná příčina (dehydratace, moč. infekce, léky, bolest).',
    depression: 'Týdny až měsíce (často po ztrátě partnera, nástupu do DS, osamění).',
  },
  {
    feature: 'Denní kolísání',
    dementia: 'Relativně stabilní (může být večerní sundowning).',
    delirium: 'Výrazně kolísá během dne (ráno klidnější, večer/v noci výrazná zmatenost a halucinace).',
    depression: 'Ranní pesimum – ráno nejhůř, k večeru se nálada může lehce zlepšovat.',
  },
  {
    feature: 'Vědomí a pozornost',
    dementia: 'Vědomí jasné (až do pozdních fází), narušená paměť a orientace.',
    delirium: 'Zastřené vědomí, rozptýlená pozornost, dezorientace místem/časem.',
    depression: 'Vědomí jasné; na otázky odpovídá zpomaleně nebo „Nevím“ (chybí motivace).',
  },
  {
    feature: 'Vratnost stavu',
    dementia: 'Progresivní, nevratná – cílem je zachování kvality života a důstojnosti.',
    delirium: 'VRATNÉ, pokud se rychle léčí vyvolávající příčina!',
    depression: 'LÉČITELNÁ (psychoterapie, aktivizace, antidepresiva).',
  },
  {
    feature: 'Okamžitá role PSS',
    dementia: 'Validace, klidná rutina, biografie, nepřít se a neopravovat bludy silou.',
    delirium: 'IHNED hlásit sestře/lékaři, zklidnit, zabezpečit proti pádu, sledovat příjem tekutin!',
    depression: 'Všímat si odmítání jídla a ztráty zájmu, citlivě naslouchat, zapojit do drobných radostí a hlásit sestře.',
  },
] as const;

export const ToolsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolTab>('decubitus');

  // --- Tab 1: Decubitus SVG Map & Norton ---
  const [bodyPosition, setBodyPosition] = useState<'back' | 'side' | 'sitting'>('back');
  const currentHotspots = useMemo(
    () => DECUBITUS_HOTSPOTS.filter((h) => h.position === bodyPosition),
    [bodyPosition]
  );
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>('back-sacrum');
  const activeHotspot =
    currentHotspots.find((h) => h.id === selectedHotspotId) ?? currentHotspots[0];

  const [norton, setNorton] = useState({
    physical: 3,
    mental: 3,
    activity: 2,
    mobility: 2,
    incontinence: 2,
  });
  const nortonResult = useMemo(() => calculateNortonScore(norton), [norton]);

  // --- Tab 2: 2026 Care Allowance & Home Fee Calculator ---
  const [isAdult, setIsAdult] = useState(true);
  const [isResidential, setIsResidential] = useState(true);
  const [unmetNeeds, setUnmetNeeds] = useState<Record<string, boolean>>({
    mobilita: true,
    hygiena: true,
    stravovani: true,
    oblekani: true,
    fyziologicka: true,
  });

  const unmetCount = useMemo(() => {
    return TEN_BASIC_LIFE_NEEDS.filter((n) => {
      if (!isAdult && !n.childEvaluated) return false;
      return Boolean(unmetNeeds[n.id]);
    }).length;
  }, [isAdult, unmetNeeds]);

  const careResult = useMemo(
    () => calculateCareAllowance(unmetCount, isAdult, isResidential),
    [unmetCount, isAdult, isResidential]
  );

  const [isSingleRoom, setIsSingleRoom] = useState(false);
  const [daysInMonth, setDaysInMonth] = useState(30);
  const [dailyRoomCzk, setDailyRoomCzk] = useState(335);
  const [dailyFoodCzk, setDailyFoodCzk] = useState(290);
  const [monthlyPensionCzk, setMonthlyPensionCzk] = useState(19500);

  const feeResult = useMemo(
    () =>
      calculateHomeFee(
        daysInMonth,
        dailyRoomCzk,
        dailyFoodCzk,
        isSingleRoom,
        monthlyPensionCzk,
        careResult.monthlyAmountCzk
      ),
    [
      daysInMonth,
      dailyRoomCzk,
      dailyFoodCzk,
      isSingleRoom,
      monthlyPensionCzk,
      careResult.monthlyAmountCzk,
    ]
  );

  const toggleNeed = (id: string) => {
    setUnmetNeeds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // --- Tab 4: KPR Metronome (110 bpm -> 545 ms) & FAST checklist ---
  const [cprActive, setCprActive] = useState(false);
  const [cprBeatCount, setCprBeatCount] = useState(0);
  const [cprSoundOn, setCprSoundOn] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [fastChecks, setFastChecks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!cprActive) return;
    const intervalMs = Math.round(60000 / 110); // 110 compressions/min (target 100-120/min)
    const id = window.setInterval(() => {
      setCprBeatCount((prev) => {
        const next = prev >= 30 ? 1 : prev + 1;
        if (cprSoundOn) {
          try {
            const Ctx =
              window.AudioContext ||
              (window as unknown as { webkitAudioContext?: typeof AudioContext })
                .webkitAudioContext;
            if (Ctx) {
              if (!audioCtxRef.current) {
                audioCtxRef.current = new Ctx();
              }
              const ctx = audioCtxRef.current;
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.frequency.value = next === 30 ? 880 : 620;
              gain.gain.setValueAtTime(0.08, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + 0.07);
            }
          } catch {
            // Ignore in headless environments without AudioContext
          }
        }
        return next;
      });
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [cprActive, cprSoundOn]);

  useEffect(() => {
    return () => {
      try {
        audioCtxRef.current?.close();
      } catch {
        // Ignore cleanup errors
      }
    };
  }, []);

  const toggleCprMetronome = () => {
    if (cprActive) {
      setCprActive(false);
      setCprBeatCount(0);
    } else {
      setCprBeatCount(1);
      setCprActive(true);
    }
  };

  const anyFastFlag = Object.values(fastChecks).some(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Praktické pomůcky & Kalkulačky (2026)
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Interaktivní mapa proleženin, škála Nortonové, výpočet příspěvku na péči i KPR metronom a
          rychlá rozvaha v krizových situacích.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('decubitus')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
            activeTab === 'decubitus'
              ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-teal-400'
          }`}
        >
          <Activity className="w-4 h-4" />
          Mapa dekubitů & Nortonová
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('calculator')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
            activeTab === 'calculator'
              ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-teal-400'
          }`}
        >
          <Calculator className="w-4 h-4" />
          Příspěvek na péči & Úhrady 2026
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('vitals')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
            activeTab === 'vitals'
              ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-teal-400'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          Vitální funkce & Kompetence
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('firstaid')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
            activeTab === 'firstaid'
              ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-rose-400'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          SOS První pomoc & KPR
        </button>
      </div>

      {/* TAB 1: DECUBITUS BODY MAP + NORTON */}
      {activeTab === 'decubitus' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">Interaktivní mapa predilekčních míst dekubitů</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Přepněte polohu klienta a klikněte na zvýrazněný bod na těle.
                </p>
              </div>
              <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {(
                  [
                    { id: 'back', label: 'Na zádech' },
                    { id: 'side', label: 'Na boku' },
                    { id: 'sitting', label: 'Vsedě (vozík)' },
                  ] as const
                ).map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => {
                      setBodyPosition(pos.id);
                      const first = DECUBITUS_HOTSPOTS.find((h) => h.position === pos.id);
                      if (first) setSelectedHotspotId(first.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      bodyPosition === pos.id
                        ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* SVG Diagram */}
              <div className="md:col-span-5 flex justify-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                <svg
                  viewBox="0 0 320 420"
                  className="w-full max-w-[260px] h-auto select-none"
                  role="img"
                  aria-label="Anatomická silueta s rizikovými body dekubitů"
                >
                  {bodyPosition === 'back' && (
                    <g
                      fill="currentColor"
                      className="text-teal-700/15 dark:text-teal-400/15 stroke-teal-700/60 dark:stroke-teal-400/60"
                      strokeWidth="2.5"
                    >
                      <line x1="25" y1="400" x2="295" y2="400" strokeDasharray="6 4" />
                      <circle cx="160" cy="48" r="26" />
                      <path d="M122 86 Q160 76 198 86 L208 228 Q160 245 112 228 Z" />
                      <path d="M120 88 L88 188 L76 248 L96 254 L108 192 L124 125" />
                      <path d="M200 88 L232 188 L244 248 L224 254 L212 192 L196 125" />
                      <path d="M116 228 L122 385 L146 385 L154 240" />
                      <path d="M204 228 L198 385 L174 385 L166 240" />
                    </g>
                  )}

                  {bodyPosition === 'side' && (
                    <g
                      fill="currentColor"
                      className="text-teal-700/15 dark:text-teal-400/15 stroke-teal-700/60 dark:stroke-teal-400/60"
                      strokeWidth="2.5"
                    >
                      <line x1="25" y1="400" x2="295" y2="400" strokeDasharray="6 4" />
                      <ellipse cx="160" cy="50" rx="24" ry="27" />
                      <path d="M140 82 Q165 80 176 92 L182 224 Q158 240 138 224 Z" />
                      <path
                        d="M148 112 L114 162 L134 205"
                        fill="none"
                        strokeWidth="14"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M145 224 L172 300 L152 382 L172 384 L192 300 L174 224" />
                    </g>
                  )}

                  {bodyPosition === 'sitting' && (
                    <g
                      fill="currentColor"
                      className="text-teal-700/15 dark:text-teal-400/15 stroke-teal-700/60 dark:stroke-teal-400/60"
                      strokeWidth="2.5"
                    >
                      <path
                        d="M88 95 L108 242 L222 242 L236 376 L258 376"
                        fill="none"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <circle cx="128" cy="316" r="56" fill="none" strokeWidth="3.5" strokeDasharray="6 3" />
                      <circle cx="136" cy="54" r="24" />
                      <path d="M114 88 L118 228 L216 232 L226 368 L244 368 L234 218 L152 210 L146 88 Z" />
                    </g>
                  )}

                  {/* Clickable Hotspots */}
                  {currentHotspots.map((spot) => {
                    const isSelected = activeHotspot?.id === spot.id;
                    return (
                      <g
                        key={spot.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedHotspotId(spot.id)}
                      >
                        <circle
                          cx={spot.x}
                          cy={spot.y}
                          r={isSelected ? 17 : 13}
                          className="hotspot-pulse fill-amber-500/35"
                        />
                        <circle
                          cx={spot.x}
                          cy={spot.y}
                          r={isSelected ? 9 : 7}
                          className={
                            isSelected
                              ? 'fill-rose-600 stroke-white stroke-2'
                              : 'fill-amber-500 stroke-white stroke-2'
                          }
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Hotspot Details */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {currentHotspots.map((spot) => (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => setSelectedHotspotId(spot.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        activeHotspot?.id === spot.id
                          ? 'bg-rose-600 border-rose-600 text-white'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {spot.name}
                    </button>
                  ))}
                </div>

                {activeHotspot && (
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="text-base font-bold text-slate-900 dark:text-white">
                      {activeHotspot.name}
                    </div>
                    <div className="text-sm text-slate-700 dark:text-slate-300">
                      <strong className="text-rose-700 dark:text-rose-400">Proč je v ohrožení: </strong>
                      {activeHotspot.whyRisk}
                    </div>
                    <div className="text-sm text-slate-700 dark:text-slate-200 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-900">
                      <strong className="text-emerald-800 dark:text-emerald-300">
                        Prevence v přímé péči:{' '}
                      </strong>
                      {activeHotspot.prevention}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4 Stages of Decubitus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {DECUBITUS_STAGES.map((st) => (
              <div
                key={st.stage}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200">
                  {st.stage}
                </span>
                <h4 className="font-bold text-sm">{st.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {st.visualSign}
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-teal-800 dark:text-teal-300">
                  <strong>PSS:</strong> {st.actionForPss}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Norton Scale */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
            <div>
              <h3 className="text-lg font-bold">Interaktivní kalkulačka škály Nortonové</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Pamatujte u zkoušky: čím NIŽŠÍ počet bodů (≤ 12), tím VYŠŠÍ riziko dekubitů!
                (Vyplňuje sestra na základě pozorování celého týmu).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                {
                  key: 'physical' as const,
                  label: '1. Fyzický stav',
                  options: [
                    { v: 4, t: '4 · Dobrý' },
                    { v: 3, t: '3 · Uspokojivý' },
                    { v: 2, t: '2 · Zhoršený' },
                    { v: 1, t: '1 · Velmi špatný' },
                  ],
                },
                {
                  key: 'mental' as const,
                  label: '2. Stav vědomí',
                  options: [
                    { v: 4, t: '4 · Jasné' },
                    { v: 3, t: '3 · Apatie' },
                    { v: 2, t: '2 · Zmatenost' },
                    { v: 1, t: '1 · Bezvědomí/stupor' },
                  ],
                },
                {
                  key: 'activity' as const,
                  label: '3. Aktivita',
                  options: [
                    { v: 4, t: '4 · Chodící' },
                    { v: 3, t: '3 · S dopomocí' },
                    { v: 2, t: '2 · Upoután na křeslo' },
                    { v: 1, t: '1 · Upoután na lůžko' },
                  ],
                },
                {
                  key: 'mobility' as const,
                  label: '4. Pohyblivost',
                  options: [
                    { v: 4, t: '4 · Plná' },
                    { v: 3, t: '3 · Částečně omezená' },
                    { v: 2, t: '2 · Velmi omezená' },
                    { v: 1, t: '1 · Nepohyblivý' },
                  ],
                },
                {
                  key: 'incontinence' as const,
                  label: '5. Inkontinence',
                  options: [
                    { v: 4, t: '4 · Není' },
                    { v: 3, t: '3 · Občasná' },
                    { v: 2, t: '2 · Převážně moč' },
                    { v: 1, t: '1 · Dvojitá (moč+stol.)' },
                  ],
                },
              ].map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <label
                    htmlFor={`norton-${field.key}`}
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    {field.label}
                  </label>
                  <select
                    id={`norton-${field.key}`}
                    value={norton[field.key]}
                    onChange={(e) =>
                      setNorton((prev) => ({
                        ...prev,
                        [field.key]: Number(e.target.value),
                      }))
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:border-teal-500"
                  >
                    {field.options.map((opt) => (
                      <option key={opt.v} value={opt.v}>
                        {opt.t}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                nortonResult.riskLevel === 'high'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
                  : nortonResult.riskLevel === 'medium'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
              }`}
            >
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider opacity-75">
                  Celkové skóre Nortonové: {nortonResult.totalScore} / 20 bodů
                </div>
                <div className="text-lg font-extrabold">{nortonResult.riskLabel}</div>
                <p className="text-xs sm:text-sm leading-relaxed">{nortonResult.guidanceForPss}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 2026 CARE ALLOWANCE & HOME FEE CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">
                  Kalkulačka 10 životních potřeb (§ 9) a Příspěvku na péči 2026
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Zaškrtněte potřeby, které klient nezvládá samostatně.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdult((a) => !a)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold cursor-pointer"
                >
                  Věk: {isAdult ? 'Dospělý (18+)' : 'Dítě do 18 let'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsResidential((r) => !r)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold cursor-pointer"
                >
                  Prostředí: {isResidential ? 'Pobytové (Domov pro seniory)' : 'Doma / Terénní'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TEN_BASIC_LIFE_NEEDS.map((need) => {
                const disabled = !isAdult && !need.childEvaluated;
                const checked = !disabled && Boolean(unmetNeeds[need.id]);
                return (
                  <button
                    key={need.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleNeed(need.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                      checked
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40'
                        : 'border-slate-200 dark:border-slate-800 hover:border-teal-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      readOnly
                      className="mt-1 accent-teal-600 w-4 h-4 pointer-events-none"
                    />
                    <div>
                      <div className="text-sm font-bold">
                        {need.number}. {need.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {need.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-teal-100 font-semibold">
                  Počet nezvládaných potřeb: {unmetCount} z {isAdult ? 10 : 9}
                </div>
                <div className="text-xl font-extrabold">{careResult.degreeLabel}</div>
                <p className="text-xs text-teal-100">{careResult.explanation}</p>
              </div>
              <div className="bg-white/15 px-5 py-3 rounded-2xl text-center shrink-0">
                <div className="text-[11px] uppercase text-teal-100">Výše v roce 2026</div>
                <div className="text-2xl font-black">
                  {careResult.monthlyAmountCzk.toLocaleString('cs-CZ')} Kč
                </div>
              </div>
            </div>
          </div>

          {/* Home Fee & 15% Remainder Calculator */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">
                  Výpočet úhrady v Domově pro seniory a pravidlo 15 % zůstatku (§ 73)
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Zákonné stropy 2026: ubytování max. 335 Kč (vícelůžkový) / 380 Kč (jednolůžkový),
                  celodenní strava max. 290 Kč/den.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setMonthlyPensionCzk(10000)}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[11px] font-semibold text-amber-800 dark:text-amber-200 cursor-pointer"
                >
                  Ukázka: nízký důchod 10 000 Kč
                </button>
                <button
                  type="button"
                  onClick={() => setMonthlyPensionCzk(22000)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Vyšší důchod 22 000 Kč
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div>
                <label htmlFor="fee-room-type" className="block text-xs font-bold mb-1">
                  Typ pokoje
                </label>
                <select
                  id="fee-room-type"
                  value={isSingleRoom ? 'single' : 'shared'}
                  onChange={(e) => {
                    const single = e.target.value === 'single';
                    setIsSingleRoom(single);
                    setDailyRoomCzk(single ? 380 : 335);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
                >
                  <option value="shared">Vícelůžkový (max 335 Kč)</option>
                  <option value="single">Jednolůžkový (max 380 Kč)</option>
                </select>
              </div>

              <div>
                <label htmlFor="fee-days" className="block text-xs font-bold mb-1">
                  Dní v měsíci ({daysInMonth})
                </label>
                <select
                  id="fee-days"
                  value={daysInMonth}
                  onChange={(e) => setDaysInMonth(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
                >
                  <option value={28}>28 dní (únor)</option>
                  <option value={30}>30 dní</option>
                  <option value={31}>31 dní</option>
                </select>
              </div>

              <div>
                <label htmlFor="fee-daily-room" className="block text-xs font-bold mb-1">
                  Denní ubytování (max {isSingleRoom ? 380 : 335} Kč)
                </label>
                <input
                  id="fee-daily-room"
                  type="number"
                  min={0}
                  max={isSingleRoom ? 380 : 335}
                  value={dailyRoomCzk}
                  onChange={(e) => setDailyRoomCzk(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
                />
              </div>

              <div>
                <label htmlFor="fee-daily-food" className="block text-xs font-bold mb-1">
                  Denní strava (max 290 Kč)
                </label>
                <input
                  id="fee-daily-food"
                  type="number"
                  min={0}
                  max={290}
                  value={dailyFoodCzk}
                  onChange={(e) => setDailyFoodCzk(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
                />
              </div>

              <div>
                <label htmlFor="fee-monthly-pension" className="block text-xs font-bold mb-1">
                  Měsíční důchod klienta (Kč)
                </label>
                <input
                  id="fee-monthly-pension"
                  type="number"
                  min={0}
                  step={500}
                  value={monthlyPensionCzk}
                  onChange={(e) => setMonthlyPensionCzk(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500">Plná cena (ubytování + strava)</div>
                <div className="text-xl font-extrabold">
                  {feeResult.fullMonthlyCostCzk.toLocaleString('cs-CZ')} Kč
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {daysInMonth} × ({feeResult.cappedRoomDailyCzk} + {feeResult.cappedFoodDailyCzk}) Kč
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
                <div className="text-xs text-amber-800 dark:text-amber-300 font-semibold">
                  Skutečná úhrada z důchodu
                </div>
                <div className="text-xl font-extrabold text-amber-900 dark:text-amber-100">
                  {feeResult.actualMonthlyPaymentCzk.toLocaleString('cs-CZ')} Kč
                </div>
                <div className="text-[11px] text-amber-800/80 dark:text-amber-200/80 mt-0.5">
                  {feeResult.isReducedBy15PercentRule
                    ? 'Sníženo zákonem – důchod nestačí na plnou úhradu!'
                    : 'Klient hradí plnou výši úhrady.'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                <div className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                  Zůstatek klientovi (min. 15 % ={' '}
                  {feeResult.mandatoryIncomeRemainderCzk.toLocaleString('cs-CZ')} Kč)
                </div>
                <div className="text-xl font-extrabold text-emerald-900 dark:text-emerald-100">
                  {feeResult.actualClientRemainderCzk.toLocaleString('cs-CZ')} Kč
                </div>
                <div className="text-[11px] text-emerald-800/80 dark:text-emerald-200/80 mt-0.5">
                  Příspěvek na péči ({feeResult.careAllowanceToProviderCzk.toLocaleString('cs-CZ')} Kč)
                  náleží domovu na péči.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VITALS & COMPETENCIES */}
      {activeTab === 'vitals' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              Přehled základních životních funkcí seniora a varovných znaků
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {VITAL_SIGNS_REFERENCE.map((v) => (
                <div
                  key={v.parameter}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {v.parameter}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                      {v.normalRange}
                    </span>
                  </div>
                  <p className="text-xs text-rose-700 dark:text-rose-300">
                    <strong>Varování:</strong> {v.warningSigns}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>Role PSS:</strong> {v.pssNote}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              Hranice kompetencí: Pracovník v sociálních službách vs. Zdravotní sestra
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 font-bold">
                  <tr>
                    <th className="p-3.5 border-b border-slate-200 dark:border-slate-700">Činnost</th>
                    <th className="p-3.5 border-b border-slate-200 dark:border-slate-700">
                      <span className="inline-flex items-center gap-1 text-teal-700 dark:text-teal-300">
                        <UserCheck className="w-4 h-4" /> Pracovník v soc. službách
                      </span>
                    </th>
                    <th className="p-3.5 border-b border-slate-200 dark:border-slate-700">
                      Zdravotní sestra
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPETENCY_MATRIX.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b last:border-b-0 border-slate-100 dark:border-slate-800"
                    >
                      <td className="p-3.5 font-semibold">{row.task}</td>
                      <td
                        className={`p-3.5 ${
                          row.pss.startsWith('NE')
                            ? 'text-rose-700 dark:text-rose-400 font-semibold'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {row.pss}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">{row.nurse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SOS FIRST AID, CPR METRONOME, FAST & 3D COMPARISON */}
      {activeTab === 'firstaid' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Interactive CPR 110/min Metronome */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold mb-1">
                    Resuscitace dospělého (KPR 30 : 2)
                  </span>
                  <h3 className="text-lg font-extrabold">Nácvikový metronom 110 úderů/min</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCprSoundOn((s) => !s)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                  aria-label={cprSoundOn ? 'Vypnout zvuk metronomu' : 'Zapnout zvuk metronomu'}
                  title={cprSoundOn ? 'Zvuk zapnutý' : 'Zvuk vypnutý'}
                >
                  {cprSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-150 ${
                      cprActive
                        ? 'bg-rose-600 text-white scale-105 shadow-md'
                        : 'bg-white dark:bg-slate-900 text-rose-600 border border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    <Heart className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-rose-700 dark:text-rose-300">
                      {cprActive ? `Stlačení ${cprBeatCount} / 30` : 'Tempo 100–120/min'}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      {cprBeatCount === 30
                        ? 'Nyní 2 vdechy (nebo pokračujte bez přerušení v masáži!)'
                        : 'Hloubka 5–6 cm · střed hrudníku · nechat hrudník uvolnit'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={toggleCprMetronome}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer transition-colors ${
                    cprActive ? 'bg-slate-800 hover:bg-slate-900' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {cprActive ? (
                    <>
                      <Square className="w-4 h-4" /> Zastavit metronom KPR
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Spustit metronom KPR (110/min)
                    </>
                  )}
                </button>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Gasping (lapavé dechy) = zástava → ihned volat 155 + AED!
                </span>
              </div>
            </div>

            {/* Interactive FAST Test Checklist */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-xs font-bold mb-1">
                  Cévní mozková příhoda (CMP)
                </span>
                <h3 className="text-lg font-extrabold">Interaktivní rychlý test FAST</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Zaškrtněte jakýkoliv zjištěný příznak u seniora:
                </p>
              </div>

              <div className="space-y-2">
                {[
                  {
                    id: 'face',
                    letter: 'F',
                    title: 'Face (Obličej)',
                    desc: 'Pokleslý ústní koutek při pokusu o úsměv nebo cenění zubů.',
                  },
                  {
                    id: 'arm',
                    letter: 'A',
                    title: 'Arm (Ruka)',
                    desc: 'Jedna předpažená paže klesá nebo je náhle slabší / necitlivá.',
                  },
                  {
                    id: 'speech',
                    letter: 'S',
                    title: 'Speech (Řeč)',
                    desc: 'Nesrozumitelná, setřelá řeč nebo klient nerozumí jednoduché větě.',
                  },
                ].map((item) => {
                  const checked = Boolean(fastChecks[item.id]);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setFastChecks((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                      }
                      className={`w-full text-left p-3 rounded-2xl border flex items-start gap-3 transition-colors cursor-pointer ${
                        checked
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700'
                          : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className="w-7 h-7 rounded-lg bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {item.letter}
                      </span>
                      <div>
                        <div className="text-sm font-bold">{item.title}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-300">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm font-semibold ${
                  anyFastFlag
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {anyFastFlag
                  ? 'T · TIME (Čas)! Stačí JEDINÝ příznak: okamžitě volejte 155, zavolejte sestru, nic nepodávejte ústy a poznamenejte PŘESNÝ čas vzniku!'
                  : 'T · Time: Čas rozhoduje o záchraně mozku – zapamatujte si vždy přesnou hodinu začátku potíží.'}
              </div>
            </div>
          </div>

          {/* 3D Differential Table: Demence vs. Delirium vs. Deprese */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Brain className="w-5 h-5 text-teal-600" />
              Rozlišení „3D“ u seniorů: Demence vs. Delirium vs. Deprese
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 font-bold">
                  <tr>
                    <th className="p-3.5 border-b border-slate-200 dark:border-slate-700">Znak</th>
                    <th className="p-3.5 border-b border-slate-200 dark:border-slate-700 text-teal-700 dark:text-teal-300">
                      Demence
                    </th>
                    <th className="p-3.5 border-b border-slate-200 dark:border-slate-700 text-rose-700 dark:text-rose-300">
                      Delirium (akutní!)
                    </th>
                    <th className="p-3.5 border-b border-slate-200 dark:border-slate-700 text-amber-700 dark:text-amber-300">
                      Deprese
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DEMENTIA_DELIRIUM_DEPRESSION.map((row) => (
                    <tr
                      key={row.feature}
                      className="border-b last:border-b-0 border-slate-100 dark:border-slate-800"
                    >
                      <td className="p-3.5 font-semibold align-top">{row.feature}</td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300 align-top">
                        {row.dementia}
                      </td>
                      <td className="p-3.5 text-rose-800 dark:text-rose-200 font-medium align-top">
                        {row.delirium}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300 align-top">
                        {row.depression}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
