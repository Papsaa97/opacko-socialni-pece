import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { GlossaryCategory } from '../types/study';
import { GLOSSARY_TERMS } from '../data';
import { normalizeCzech } from '../utils/studyLogic';

const CATEGORIES: (GlossaryCategory | 'Vše')[] = [
  'Vše',
  'Legislativa',
  'Ošetřovatelství',
  'Psychologie a demence',
  'Komunikace a aktivizace',
  'První pomoc a hygiena',
];

export const GlossaryView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<GlossaryCategory | 'Vše'>('Vše');

  const filteredTerms = useMemo(() => {
    const q = normalizeCzech(query);
    return GLOSSARY_TERMS.filter((t) => {
      if (category !== 'Vše' && t.category !== category) return false;
      if (!q) return true;
      return normalizeCzech(`${t.term} ${t.definition} ${t.practicalTip}`).includes(q);
    }).sort((a, b) => a.term.localeCompare(b.term, 'cs'));
  }, [query, category]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Slovník klíčových pojmů ({GLOSSARY_TERMS.length})
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Vyhledávejte i bez háčků a čárek (např. „dekubit“, „afazie“, „nortonova“, „89“).
        </p>
      </div>

      {/* Search & Category Pills */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hledat pojem nebo definici…"
            aria-label="Hledat ve slovníku pojmů"
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm sm:text-base outline-none focus:border-teal-500 shadow-xs"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                category === cat
                  ? 'bg-teal-600 border-teal-600 text-white'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredTerms.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
          Žádný pojem neodpovídá hledání „{query}“.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredTerms.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{item.term}</h3>
                <span className="shrink-0 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {item.category}
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {item.definition}
              </p>
              <div className="text-xs text-teal-800 dark:text-teal-300 bg-teal-50/70 dark:bg-teal-950/30 p-2.5 rounded-xl">
                <strong>V praxi DS:</strong> {item.practicalTip}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
