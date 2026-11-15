import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeftRight,
  Award,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Shuffle,
  Sparkles,
} from 'lucide-react';
import type { CardBoxLevel, ModuleId, UserProgress } from '../types/study';
import { FLASHCARDS, STUDY_MODULES } from '../data';
import { selectSmartFlashcards, shuffleArray } from '../utils/studyLogic';

interface FlashcardsViewProps {
  initialModuleFilter: ModuleId | 'all';
  progress: UserProgress;
  onRateCard: (cardId: string, level: Exclude<CardBoxLevel, 0>) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  initialModuleFilter,
  progress,
  onRateCard,
}) => {
  const [moduleFilter, setModuleFilter] = useState<ModuleId | 'all'>(initialModuleFilter);
  const [onlyUnmastered, setOnlyUnmastered] = useState(false);
  const [reverseMode, setReverseMode] = useState(false);
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [deckIds, setDeckIds] = useState<string[]>(() =>
    selectSmartFlashcards(FLASHCARDS, progress.cardBoxes, initialModuleFilter, false).map(
      (c) => c.id
    )
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const rebuildDeck = (nextFilter: ModuleId | 'all', nextUnmastered: boolean) => {
    const nextIds = selectSmartFlashcards(
      FLASHCARDS,
      progress.cardBoxes,
      nextFilter,
      nextUnmastered
    ).map((c) => c.id);
    setDeckIds(nextIds);
    setCurrentIndex(0);
    setIsFlipped(false);
    setRoundCompleted(false);
  };

  useEffect(() => {
    setModuleFilter(initialModuleFilter);
    rebuildDeck(initialModuleFilter, onlyUnmastered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialModuleFilter]);

  const deck = useMemo(() => {
    const byId = new Map(FLASHCARDS.map((c) => [c.id, c]));
    return deckIds.map((id) => byId.get(id)).filter((c): c is NonNullable<typeof c> => Boolean(c));
  }, [deckIds]);

  const safeIndex = deck.length > 0 ? Math.min(currentIndex, deck.length - 1) : 0;
  const currentCard = deck[safeIndex];

  const handleNext = () => {
    if (deck.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const handlePrev = () => {
    if (deck.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const handleRate = (level: Exclude<CardBoxLevel, 0>) => {
    if (!currentCard) return;
    onRateCard(currentCard.id, level);
    setIsFlipped(false);
    if (safeIndex + 1 >= deck.length) {
      setRoundCompleted(true);
    } else {
      setCurrentIndex(safeIndex + 1);
    }
  };

  const handleShuffle = () => {
    setDeckIds(shuffleArray(deckIds));
    setCurrentIndex(0);
    setIsFlipped(false);
    setRoundCompleted(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const deltaX = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) >= 55) {
      e.stopPropagation();
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === '1' && isFlipped) {
        handleRate(1);
      } else if (e.key === '2' && isFlipped) {
        handleRate(2);
      } else if (e.key === '3' && isFlipped) {
        handleRate(3);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const stats = useMemo(() => {
    const scope =
      moduleFilter === 'all'
        ? FLASHCARDS
        : FLASHCARDS.filter((c) => c.moduleId === moduleFilter);
    let box1 = 0;
    let box2 = 0;
    let box3 = 0;
    let unseen = 0;
    for (const c of scope) {
      const b = progress.cardBoxes[c.id] ?? 0;
      if (b === 1) box1++;
      else if (b === 2) box2++;
      else if (b === 3) box3++;
      else unseen++;
    }
    return { total: scope.length, box1, box2, box3, unseen };
  }, [moduleFilter, progress.cardBoxes]);

  const currentModuleName = currentCard
    ? STUDY_MODULES.find((m) => m.id === currentCard.moduleId)?.shortTitle
    : '';

  const frontContent = currentCard
    ? reverseMode
      ? currentCard.answer
      : currentCard.question
    : '';
  const backContent = currentCard
    ? reverseMode
      ? currentCard.question
      : currentCard.answer
    : '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Opakovací kartičky
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Chytré řazení přednostně vrací kartičky, ve kterých jste minule zaváhala. Na mobilu
            funguje i přejetí prstem.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start">
          <button
            type="button"
            onClick={() => {
              setReverseMode((r) => !r);
              setIsFlipped(false);
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
              reverseMode
                ? 'bg-teal-600 border-teal-600 text-white'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title="Prohodí líc a rub kartičky (zkoušení obráceně)"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            {reverseMode ? 'Obrácený režim ✓' : 'Obrátit otázku ↔ odpověď'}
          </button>

          <button
            type="button"
            onClick={handleShuffle}
            disabled={deck.length < 2}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer disabled:opacity-50"
          >
            <Shuffle className="w-4 h-4 text-teal-600" />
            Zamíchat balíček
          </button>
        </div>
      </div>

      {/* Filters & Stats */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={moduleFilter}
              onChange={(e) => {
                const nextFilter = e.target.value as ModuleId | 'all';
                setModuleFilter(nextFilter);
                rebuildDeck(nextFilter, onlyUnmastered);
              }}
              aria-label="Filtrovat okruh kartiček"
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium outline-none focus:border-teal-500"
            >
              <option value="all">Všech 8 okruhů ({FLASHCARDS.length} kartiček)</option>
              {STUDY_MODULES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.order}. {m.shortTitle}
                </option>
              ))}
            </select>

            <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium cursor-pointer select-none px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <input
                type="checkbox"
                checked={onlyUnmastered}
                onChange={(e) => {
                  const nextVal = e.target.checked;
                  setOnlyUnmastered(nextVal);
                  rebuildDeck(moduleFilter, nextVal);
                }}
                className="accent-teal-600 w-4 h-4"
              />
              Jen neosvojené
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
              Umím: {stats.box3}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold">
              Zaváhání: {stats.box2}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-semibold">
              Procvičit: {stats.box1}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              Nové: {stats.unseen}
            </span>
          </div>
        </div>
      </div>

      {/* Main Flashcard Stage */}
      {!currentCard ? (
        <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <Sparkles className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold">
            Skvělá práce! Všechny kartičky v tomto filtru už máte zvládnuté.
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Zrušte zaškrtnutí „Jen neosvojené“ nebo vyberte jiný okruh.
          </p>
        </div>
      ) : roundCompleted ? (
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <Award className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Kolo všech {deck.length} kartiček dokončeno!
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            V tomto okruhu už umíte skvěle <strong>{stats.box3}</strong> z{' '}
            <strong>{stats.total}</strong> kartiček. Slabší kartičky se v dalším kole automaticky
            zařadí na začátek.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setOnlyUnmastered(true);
                rebuildDeck(moduleFilter, true);
              }}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold cursor-pointer"
            >
              Procvičit jen neosvojené
            </button>
            <button
              type="button"
              onClick={() => rebuildDeck(moduleFilter, false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold cursor-pointer"
            >
              Projít celý balíček znovu
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
              <span>
                Kartička {safeIndex + 1} z {deck.length}
              </span>
              <span>Klávesy: Mezerník = otočit · 1 / 2 / 3 = ohodnotit</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-teal-600 transition-all duration-300"
                style={{ width: `${Math.round(((safeIndex + 1) / deck.length) * 100)}%` }}
              />
            </div>
          </div>

          <div
            className="card-perspective cursor-pointer touch-pan-y"
            onClick={() => setIsFlipped((f) => !f)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="button"
            tabIndex={0}
            aria-label="Otočit opakovací kartičku"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setIsFlipped((f) => !f);
              }
            }}
          >
            <div className={`card-inner min-h-[300px] sm:min-h-[330px] ${isFlipped ? 'is-flipped' : ''}`}>
              {/* Front */}
              <div
                className={`card-face absolute inset-0 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-md p-6 sm:p-8 flex flex-col justify-between overflow-y-auto ${
                  isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 text-xs font-semibold">
                    {currentModuleName}
                    {reverseMode ? ' · rub napřed' : ''}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5" />
                    Klikněte pro odpověď
                  </span>
                </div>

                <div className="my-auto py-4 text-center">
                  <h3
                    className={`font-bold text-slate-900 dark:text-white leading-snug whitespace-pre-line ${
                      reverseMode ? 'text-base sm:text-lg font-medium text-left' : 'text-lg sm:text-2xl'
                    }`}
                  >
                    {frontContent}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1.5 justify-center">
                  {currentCard.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Back */}
              <div
                className={`card-face card-face-back absolute inset-0 rounded-3xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-slate-900 dark:to-teal-950/50 border-2 border-teal-500/70 dark:border-teal-600 shadow-md p-6 sm:p-8 flex flex-col justify-between overflow-y-auto ${
                  !isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-teal-600 text-white text-xs font-semibold">
                    {reverseMode ? 'Otázka ke kartičce' : 'Správná odpověď'}
                  </span>
                  <span className="text-xs text-teal-700 dark:text-teal-300 flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5" />
                    Zpět na přední stranu
                  </span>
                </div>

                <div className="my-auto py-3 space-y-3">
                  <p
                    className={`font-medium text-slate-900 dark:text-slate-100 whitespace-pre-line leading-relaxed ${
                      reverseMode ? 'text-base sm:text-xl font-bold text-center' : 'text-sm sm:text-base'
                    }`}
                  >
                    {backContent}
                  </p>
                  {currentCard.mnemonic && (
                    <div className="p-3 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300/70 dark:border-amber-800 text-xs sm:text-sm text-amber-950 dark:text-amber-100">
                      <strong>Pomůcka:</strong> {currentCard.mnemonic}
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                  Ohodnoťte níže, jak jistě jste si vzpomněla ↓
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="Předchozí kartička"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setIsFlipped((f) => !f)}
                className="px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                Otočit kartičku
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="Další kartička"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleRate(1)}
                className="px-3 py-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/70 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-800 dark:text-rose-200 text-xs font-bold transition-colors cursor-pointer"
              >
                1 · Ještě neumím
              </button>
              <button
                type="button"
                onClick={() => handleRate(2)}
                className="px-3 py-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/70 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs font-bold transition-colors cursor-pointer"
              >
                2 · S zaváháním
              </button>
              <button
                type="button"
                onClick={() => handleRate(3)}
                className="px-3 py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-bold transition-colors cursor-pointer"
              >
                3 · Umím skvěle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
