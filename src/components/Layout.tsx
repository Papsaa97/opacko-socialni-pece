import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  ClipboardCheck,
  Download,
  FileText,
  Flame,
  GraduationCap,
  HeartHandshake,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  Moon,
  RotateCcw,
  Search,
  Sparkles,
  Stethoscope,
  Sun,
  Upload,
  X,
} from 'lucide-react';
import type { ModuleId, NavViewId, UserProgress } from '../types/study';
import { FLASHCARDS, GLOSSARY_TERMS, STUDY_MODULES } from '../data';
import { normalizeCzech } from '../utils/studyLogic';

interface LayoutProps {
  activeView: NavViewId;
  onNavigate: (
    view: NavViewId,
    moduleId?: ModuleId,
    options?: { sectionId?: string; glossaryQuery?: string }
  ) => void;
  progress: UserProgress;
  onToggleTheme: () => void;
  onExportJson: () => string;
  onImportJson: (raw: string) => boolean;
  onResetProgress: () => void;
  children: React.ReactNode;
}

interface NavItem {
  id: NavViewId;
  label: string;
  mobileLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Přehled & Plán', mobileLabel: 'Přehled', icon: LayoutDashboard },
  { id: 'modules', label: `Studijní okruhy (${STUDY_MODULES.length})`, mobileLabel: 'Okruhy', icon: BookOpen },
  { id: 'flashcards', label: `Kartičky (${FLASHCARDS.length})`, mobileLabel: 'Kartičky', icon: Layers },
  { id: 'quiz', label: 'Testy & Zkouška', mobileLabel: 'Testy', icon: ClipboardCheck },
  { id: 'scenarios', label: 'Modelové situace', mobileLabel: 'Praxe', icon: HeartHandshake },
  { id: 'tools', label: 'Pomůcky & Kalkulačky', mobileLabel: 'Pomůcky', icon: Stethoscope },
  { id: 'glossary', label: 'Slovník pojmů', mobileLabel: 'Slovník', icon: GraduationCap },
  { id: 'cheatsheet', label: 'Tahák ke zkoušce', mobileLabel: 'Tahák', icon: FileText },
];

const MOBILE_PRIMARY_IDS: NavViewId[] = ['dashboard', 'modules', 'flashcards', 'quiz'];
const MOBILE_PRIMARY_ITEMS = NAV_ITEMS.filter((item) => MOBILE_PRIMARY_IDS.includes(item.id));
const MOBILE_MORE_ITEMS = NAV_ITEMS.filter((item) => !MOBILE_PRIMARY_IDS.includes(item.id));

export const Layout: React.FC<LayoutProps> = ({
  activeView,
  onNavigate,
  progress,
  onToggleTheme,
  onExportJson,
  onImportJson,
  onResetProgress,
  children,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [backupOpen, setBackupOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setInstallPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    try {
      const choice = await installPrompt.userChoice;
      if (choice?.outcome === 'accepted') {
        setInstallPrompt(null);
      }
    } catch {
      setInstallPrompt(null);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setBackupOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const searchResults = useMemo(() => {
    const q = normalizeCzech(searchQuery);
    if (q.length < 2) return { modules: [], glossary: [], cards: [] };

    const moduleHits: {
      moduleId: ModuleId;
      moduleTitle: string;
      sectionId: string;
      sectionTitle: string;
      snippet: string;
    }[] = [];
    for (const mod of STUDY_MODULES) {
      for (const sec of mod.sections) {
        const haystack = normalizeCzech(
          `${mod.title} ${sec.title} ${sec.summary} ${sec.keyPoints.join(' ')}`
        );
        if (haystack.includes(q)) {
          moduleHits.push({
            moduleId: mod.id,
            moduleTitle: mod.shortTitle,
            sectionId: sec.id,
            sectionTitle: sec.title,
            snippet: sec.summary,
          });
        }
      }
    }

    const glossaryHits = GLOSSARY_TERMS.filter((t) =>
      normalizeCzech(`${t.term} ${t.definition} ${t.practicalTip}`).includes(q)
    ).slice(0, 6);

    const cardHits = FLASHCARDS.filter((c) =>
      normalizeCzech(`${c.question} ${c.answer}`).includes(q)
    ).slice(0, 5);

    return {
      modules: moduleHits.slice(0, 6),
      glossary: glossaryHits,
      cards: cardHits,
    };
  }, [searchQuery]);

  const handleDownloadBackup = () => {
    const data = onExportJson();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'opacko-pss-postup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = onImportJson(String(reader.result ?? ''));
      setImportStatus(ok ? 'Postup byl úspěšně obnoven!' : 'Soubor nemá platný formát.');
    };
    reader.readAsText(file);
  };

  const mistakeCount = progress.mistakeQuestionIds.length;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f6f8f7] dark:bg-[#0b1215] text-slate-900 dark:text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="no-print hidden lg:flex lg:flex-col lg:w-72 lg:shrink-0 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/95 sticky top-0 h-screen">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 text-left w-full group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-sm shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                Pečuj s jistotou
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Opáčko PSS · Domov pro seniory
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="mt-4 w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-sm text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Hledat pojem nebo §…
            </span>
            <kbd className="text-[11px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500">
              Ctrl K
            </kbd>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Hlavní navigace">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-teal-50/70 dark:hover:bg-slate-800/80 hover:text-teal-800 dark:hover:text-teal-300'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </span>
                {item.id === 'quiz' && mistakeCount > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200'
                    }`}
                    title="Otázky v chybovníku k zopakování"
                  >
                    {mistakeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/60">
            <span className="flex items-center gap-2 text-xs font-medium text-amber-900 dark:text-amber-200">
              <Flame className="w-4 h-4 text-amber-500" />
              Studijní série
            </span>
            <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
              {progress.streakDays} {progress.streakDays === 1 ? 'den' : progress.streakDays < 5 && progress.streakDays > 0 ? 'dny' : 'dní'}
            </span>
          </div>

          {installPrompt && (
            <button
              type="button"
              onClick={handleInstallApp}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Nainstalovat aplikaci
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors cursor-pointer"
              aria-label="Přepnout světlý a tmavý režim"
            >
              {progress.theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  Světlý režim
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-600" />
                  Tmavý režim
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setImportStatus(null);
                setBackupOpen(true);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors cursor-pointer"
              title="Záloha a správa postupu"
            >
              Záloha
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="no-print lg:hidden sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">Pečuj s jistotou</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Opáčko PSS</div>
          </div>
        </button>

        <div className="flex items-center gap-1.5">
          {installPrompt && (
            <button
              type="button"
              onClick={handleInstallApp}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              aria-label="Nainstalovat aplikaci"
              title="Nainstalovat aplikaci na plochu"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Instalovat</span>
            </button>
          )}
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            {progress.streakDays}
          </span>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            aria-label="Hledat"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            aria-label="Přepnout motiv"
          >
            {progress.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 min-w-0 pb-24 lg:pb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 print-only-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation: 4 main sections + "Více" sheet (fits 360px phones without side-scrolling) */}
      {mobileMoreOpen && (
        <div
          className="no-print lg:hidden fixed inset-0 z-30 bg-slate-950/40"
          onClick={() => setMobileMoreOpen(false)}
          aria-hidden="true"
        />
      )}
      {mobileMoreOpen && (
        <div
          id="mobile-more-menu"
          className="no-print lg:hidden fixed inset-x-3 bottom-20 z-40 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl grid grid-cols-2 gap-2"
        >
          {MOBILE_MORE_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setMobileMoreOpen(false);
                  onNavigate(item.id);
                }}
                className={`flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.mobileLabel === 'Praxe' ? 'Situace & ústní' : item.mobileLabel}</span>
              </button>
            );
          })}
        </div>
      )}
      <nav
        className="no-print lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-1.5 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] grid grid-cols-5 gap-1"
        aria-label="Mobilní navigace"
      >
        {MOBILE_PRIMARY_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setMobileMoreOpen(false);
                onNavigate(item.id);
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`min-w-0 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[11px] font-medium transition-colors relative ${
                isActive
                  ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="truncate max-w-full">{item.mobileLabel}</span>
              {item.id === 'quiz' && mistakeCount > 0 && (
                <span className="absolute top-0.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {mistakeCount > 9 ? '9+' : mistakeCount}
                </span>
              )}
            </button>
          );
        })}
        {(() => {
          const activeMore = MOBILE_MORE_ITEMS.find((item) => item.id === activeView);
          const MoreIcon = activeMore ? activeMore.icon : LayoutGrid;
          const highlighted = Boolean(activeMore) || mobileMoreOpen;
          return (
            <button
              type="button"
              onClick={() => setMobileMoreOpen((open) => !open)}
              aria-expanded={mobileMoreOpen}
              aria-controls="mobile-more-menu"
              aria-label={activeMore ? `${activeMore.mobileLabel} – další sekce` : 'Další sekce'}
              className={`min-w-0 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[11px] font-medium transition-colors ${
                highlighted
                  ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <MoreIcon className="w-5 h-5 mb-0.5" />
              <span className="truncate max-w-full">{activeMore ? activeMore.mobileLabel : 'Více'}</span>
            </button>
          );
        })()}
      </nav>

      {/* Global Search Modal */}
      {searchOpen && (
        <div
          className="no-print fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-20"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <Search className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hledejte bez diakritiky: např. dekubit, § 89, Nortonova, afazie, KPR…"
                className="flex-1 bg-transparent outline-none text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                aria-label="Zavřít hledání"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-4 space-y-5">
              {searchQuery.trim().length < 2 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">
                  Zadejte alespoň 2 znaky – prohledáme studijní okruhy, slovník pojmů i kartičky.
                </p>
              ) : searchResults.modules.length === 0 &&
                searchResults.glossary.length === 0 &&
                searchResults.cards.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">
                  Pro „{searchQuery}“ nebylo nic nalezeno. Zkuste kratší klíčové slovo.
                </p>
              ) : (
                <>
                  {searchResults.modules.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Studijní okruhy
                      </h3>
                      <div className="space-y-1.5">
                        {searchResults.modules.map((hit, idx) => (
                          <button
                            key={`${hit.moduleId}-${idx}`}
                            type="button"
                            onClick={() => {
                              setSearchOpen(false);
                              onNavigate('modules', hit.moduleId, { sectionId: hit.sectionId });
                            }}
                            className="w-full text-left p-3 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
                          >
                            <div className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                              {hit.moduleTitle}
                            </div>
                            <div className="text-sm font-semibold">{hit.sectionTitle}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                              {hit.snippet}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.glossary.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Slovník pojmů
                      </h3>
                      <div className="space-y-1.5">
                        {searchResults.glossary.map((term) => (
                          <button
                            key={term.id}
                            type="button"
                            onClick={() => {
                              setSearchOpen(false);
                              onNavigate('glossary', undefined, { glossaryQuery: term.term });
                            }}
                            className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
                          >
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                              {term.term}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                              {term.definition}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.cards.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Opakovací kartičky
                      </h3>
                      <div className="space-y-1.5">
                        {searchResults.cards.map((card) => (
                          <button
                            key={card.id}
                            type="button"
                            onClick={() => {
                              setSearchOpen(false);
                              onNavigate('flashcards', card.moduleId);
                            }}
                            className="w-full text-left p-3 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
                          >
                            <div className="text-sm font-medium">{card.question}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Backup / Reset Modal */}
      {backupOpen && (
        <div
          className="no-print fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setBackupOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Záloha a správa postupu</h2>
              <button
                type="button"
                onClick={() => setBackupOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Váš studijní postup se automaticky ukládá přímo do tohoto prohlížeče. Pokud chcete
              přejít na jiné zařízení (např. z mobilu na počítač), můžete si zálohu stáhnout jako
              soubor a jinde ji nahrát.
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Stáhnout zálohu postupu (.json)
              </button>

              <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                Obnovit postup ze souboru
                <input type="file" accept="application/json" onChange={handleUploadBackup} className="hidden" />
              </label>

              {importStatus && (
                <p className="text-xs font-medium text-center text-teal-700 dark:text-teal-400">
                  {importStatus}
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setImportStatus('Veškerý studijní postup byl vynulován.');
                }}
                className="mt-2 flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Vynulovat celý postup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
