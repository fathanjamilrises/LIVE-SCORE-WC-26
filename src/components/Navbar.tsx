import { Sun, Moon, Calendar, Award, Trophy, Users, Heart, Info, Play, RefreshCw } from "lucide-react";

interface NavbarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onSimulateAll: () => void;
  onResetAll: () => void;
  hasLiveMatches: boolean;
}

export default function Navbar({
  currentTab,
  setTab,
  darkMode,
  setDarkMode,
  onSimulateAll,
  onResetAll,
  hasLiveMatches,
}: NavbarProps) {
  const tabs = [
    { id: "jadwal", label: "Live & Jadwal", icon: Calendar },
    { id: "klasemen", label: "Klasemen", icon: Award },
    { id: "bagan", label: "Bagan", icon: Trophy },
    { id: "tim", label: "Tim 48", icon: Users },
    { id: "favorit", label: "Favorit Saya", icon: Heart },
    { id: "tentang", label: "Tentang", icon: Info },
  ];

  return (
    <>
      {/* DESKTOP HEADER */}
      <header className="sticky top-0 z-40 w-full border-b-4 border-ink bg-paper dark:bg-paper-dark transition-colors duration-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
          {/* Brand Logo Wordmark */}
          <div 
            onClick={() => setTab("jadwal")}
            className="flex cursor-pointer items-center gap-2 border-2 border-ink bg-signal-yellow px-3 py-1 font-display text-xl md:text-2xl tracking-tighter text-ink shadow-[3px_3px_0_#111] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#111] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0_0_0_#111] transition-all"
          >
            ⚽ WC26 <span className="hidden sm:inline">/ LIVE</span>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = currentTab === t.id;
              return (
                <button
                  key={t.id}
                  id={`nav-tab-${t.id}`}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 border-2 border-ink px-4 py-2 font-sans text-sm font-bold shadow-[2px_2px_0_var(--color-ink)] transition-all cursor-pointer ${
                    isActive
                      ? "bg-electric-blue text-paper"
                      : "bg-paper dark:bg-paper-dark hover:bg-signal-yellow hover:text-ink text-ink dark:text-paper"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </nav>

          {/* Settings & Simulation Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSimulateAll}
              title="Simulasikan Pertandingan"
              className="flex items-center gap-1.5 border-2 border-ink bg-azteca-green text-paper px-3 py-1.5 font-mono text-xs font-bold shadow-[2px_2px_0_var(--color-ink)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_var(--color-ink)] transition-all cursor-pointer"
            >
              <Play className="h-3 w-3 fill-current" />
              <span className="hidden lg:inline">Simulation</span>
            </button>
            <button
              onClick={onResetAll}
              title="Reset Turnamen"
              className="flex items-center gap-1 border-2 border-ink bg-stadium-red text-paper px-2 py-1.5 font-mono text-xs font-bold shadow-[2px_2px_0_var(--color-ink)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_var(--color-ink)] transition-all cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
            </button>

            {/* Dark Mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="border-2 border-ink bg-paper dark:bg-paper-dark p-2 hover:bg-signal-yellow text-ink dark:text-paper shadow-[2px_2px_0_var(--color-ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-0 transition-all cursor-pointer"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Global Marquee Ticker banner */}
        <div className="w-full border-t-2 border-ink bg-ink text-signal-yellow py-1 text-center font-mono text-xs overflow-hidden whitespace-nowrap tracking-wide select-none">
          <div className="inline-block animate-[marquee_25s_infinite_linear]">
            🔥 PIALA DUNIA 2026 - FORMAT BARU 48 TIM • 12 GRUP • 104 LAGA PECAH SEJARAH • KANADA - MEKSIKO - USA • LIVE SIMULATION ACTIVE
            {hasLiveMatches && "  🔴 ADA PERTANDINGAN SEDANG LIVE!"}
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t-4 border-ink bg-paper dark:bg-paper-dark selection:bg-signal-yellow/30 pb-safe shadow-[0_-4px_0_rgba(17,17,17,0.05)] transition-colors duration-200">
        <div className="grid grid-cols-6 items-center justify-around py-1 text-center">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = currentTab === t.id;
            return (
              <button
                key={t.id}
                id={`mobile-tab-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 transition-all border-r border-ink/10 last:border-r-0 cursor-pointer ${
                  isActive
                    ? "bg-signal-yellow text-ink font-bold shadow-[inset_0_-4px_0_var(--color-electric-blue)]"
                    : "text-ink/70 dark:text-paper/70"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "stroke-2" : "stroke-1.5"}`} />
                <span className="text-[9px] mt-1 font-sans tracking-tight leading-none truncate max-w-full">
                  {t.id === "jadwal" ? "Jadwal" : t.id === "klasemen" ? "Klasemen" : t.id === "bagan" ? "Bagan" : t.id === "tim" ? "Tim" : t.id === "favorit" ? "Fav" : "Tentang"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
