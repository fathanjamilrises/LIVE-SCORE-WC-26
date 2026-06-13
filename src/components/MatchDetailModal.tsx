import { useState } from "react";
import { Match, Team, Venue, StandingRow } from "../types";
import { COUNTRY_FLAG_EMOJIS, PLACEHOLDER_NAMES } from "../data";
import { calculateStandings } from "../utils";
import { X, Play, ShieldAlert, Award, Star, ListOrdered, ClipboardList } from "lucide-react";
import { useMatchLineup, useMatchStats } from "../hooks/useApiFootball";
import { LineupView } from "./LineupView";
import { MatchTimeline } from "./MatchTimeline";
import { ApiQuotaBadge } from "./ApiQuotaBadge";

interface MatchDetailModalProps {
  matchId: string;
  matches: Match[];
  teams: Team[];
  venues: Venue[];
  onClose: () => void;
  onSimulateSingle?: (matchId: string) => void;
}

export default function MatchDetailModal({
  matchId,
  matches,
  teams,
  venues,
  onClose,
  onSimulateSingle,
}: MatchDetailModalProps) {
  const match = matches.find((m) => m.id === matchId);
  if (!match) return null;

  const [activeTab, setActiveTab] = useState<"ringkasan" | "lineup" | "stats" | "klasemen">("ringkasan");

  const homeTeam = teams.find((t) => t.id === match.homeTeamId);
  const awayTeam = teams.find((t) => t.id === match.awayTeamId);
  const venue = venues.find((v) => v.id === match.venueId);

  const homeName = homeTeam ? homeTeam.name : PLACEHOLDER_NAMES[match.homeTeamId] || match.homeTeamId;
  const awayName = awayTeam ? awayTeam.name : PLACEHOLDER_NAMES[match.awayTeamId] || match.awayTeamId;

  const homeFlag = homeTeam?.flagUrl ? <img src={homeTeam.flagUrl} alt="" className="h-10 w-16 md:h-12 md:w-20 object-cover border-2 border-ink/20" /> : (homeTeam ? COUNTRY_FLAG_EMOJIS[homeTeam.flagCode] || "🏳️" : "🔮");
  const awayFlag = awayTeam?.flagUrl ? <img src={awayTeam.flagUrl} alt="" className="h-10 w-16 md:h-12 md:w-20 object-cover border-2 border-ink/20" /> : (awayTeam ? COUNTRY_FLAG_EMOJIS[awayTeam.flagCode] || "🏳️" : "🔮");

  const isLive = match.status === "live" || match.status === "ht" || match.status === "et" || match.status === "pen";

  // API-Football Data
  const { data: statsData, isLoading: isLoadingStats } = useMatchStats(activeTab === "stats" ? matchId : null, isLive);

  // Parse Stats
  const getStat = (teamStats: any[], type: string) => {
      const stat = teamStats?.find((s: any) => s.type === type);
      if (!stat || stat.value === null) return 0;
      if (typeof stat.value === 'string' && stat.value.includes('%')) return parseInt(stat.value, 10);
      return parseInt(stat.value, 10) || 0;
  };

  const getStatData = (stats: any[], index: number, matchTeamId: string, teamName: string) => {
    if (!stats || stats.length === 0) return [];
    const found = stats.find((s: any) => String(s.team.id) === matchTeamId || s.team.name === teamName);
    if (found) return found.statistics || [];
    // Fallback to array order since API-Football returns [homeStats, awayStats]
    return stats[index]?.statistics || [];
  };

  const homeStatData = getStatData(statsData || [], 0, match.homeTeamId, homeName);
  const awayStatData = getStatData(statsData || [], 1, match.awayTeamId, awayName);

  const useRealStats = homeStatData.length > 0 || awayStatData.length > 0;

  const renderStatsBars = () => {
    if (statsData === null) {
      return <div className="text-center font-sans py-12 text-ink/50 dark:text-paper/50 font-medium">Data statistik tidak tersedia untuk pertandingan ini.</div>;
    }
    
    if (!useRealStats) {
      return <div className="text-center font-sans py-12 text-ink/50 dark:text-paper/50 font-medium whitespace-pre-wrap">Data statistik belum dirilis.</div>;
    }

    const STAT_FIELDS = [
      { key: "Shots on Goal", label: "SHOTS ON GOAL" },
      { key: "Shots off Goal", label: "SHOTS OFF GOAL" },
      { key: "Total Shots", label: "TOTAL SHOTS" },
      { key: "Blocked Shots", label: "BLOCKED SHOTS" },
      { key: "Shots insidebox", label: "SHOTS INSIDEBOX" },
      { key: "Shots outsidebox", label: "SHOTS OUTSIDEBOX" },
      { key: "Fouls", label: "FOULS" },
      { key: "Corner Kicks", label: "CORNER KICKS" },
      { key: "Offsides", label: "OFFSIDES" },
      { key: "Ball Possession", label: "BALL POSSESSION", unit: "%" },
      { key: "Yellow Cards", label: "YELLOW CARDS" },
      { key: "Red Cards", label: "RED CARDS" },
      { key: "Goalkeeper Saves", label: "GOALKEEPER SAVES" },
      { key: "Total passes", label: "TOTAL PASSES" },
      { key: "Passes accurate", label: "PASSES ACCURATE" },
      { key: "Passes %", label: "PASSES %", unit: "%" },
    ];

    return (
      <div className="flex flex-col gap-5 pt-2">
        {STAT_FIELDS.map((field) => {
          const homeVal = getStat(homeStatData, field.key);
          const awayVal = getStat(awayStatData, field.key);
          const total = homeVal + awayVal;
          const homePct = total > 0 ? (homeVal / total) * 100 : 0;
          const awayPct = total > 0 ? (awayVal / total) * 100 : 0;

          return (
            <div key={field.key} className="flex flex-col justify-center gap-1.5">
              <div className="text-center font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-ink dark:text-paper z-10 w-full mb-0.5">
                {field.label}
              </div>
              
              <div className="flex items-center w-full gap-3">
                <div className="w-8 shrink-0 text-left opacity-70 font-sans font-bold text-sm">{homeVal}{field.unit}</div>
                
                <div className="flex-1 flex h-1.5 sm:h-2 rounded-full overflow-hidden bg-ink/10 dark:bg-paper/10">
                   {/* Left Side */}
                   <div className="w-1/2 h-full flex justify-end">
                      <div 
                        style={{ width: `${homePct}%` }} 
                        className="h-full bg-electric-blue transition-all duration-300" 
                      />
                   </div>
                   {/* Right Side */}
                   <div className="w-1/2 h-full flex justify-start">
                      <div 
                        style={{ width: `${awayPct}%` }} 
                        className="h-full bg-stadium-green transition-all duration-300" 
                      />
                   </div>
                </div>
                
                <div className="w-8 shrink-0 text-right opacity-70 font-sans font-bold text-sm">{awayVal}{field.unit}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-xs select-none">
      {/* Container */}
      <div className="relative w-full max-w-2xl bg-paper dark:bg-asphalt border-4 border-ink dark:border-paper shadow-[8px_8px_0_var(--color-ink)] dark:shadow-[8px_8px_0_var(--color-paper)] p-4 md:p-6 text-ink dark:text-paper max-h-[90vh] overflow-y-auto rounded-none transition-colors duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 border-2 border-ink bg-paper hover:bg-stadium-red hover:text-paper text-ink p-1.5 shadow-[2px_2px_0_#111] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer z-55"
        >
          <X className="h-5 w-5" />
        </button>

        {/* HEADER SECTION */}
        <div className="text-center pb-4 border-b-4 border-ink dark:border-paper">
          <span className="font-mono text-xs font-black bg-ink text-paper px-3 py-1 uppercase tracking-widest select-none">
            {match.stage === "group" ? `GRUP ${match.group || ""} • MATCH INFO` : "FASE GUGUR MATCH"}
          </span>

          {/* Teams and Scores Display */}
          <div className="flex items-center justify-around my-6">
            {/* Home */}
            <div className="flex flex-col items-center w-5/12 text-center">
              <span className="text-5xl md:text-6xl filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] select-none">
                {homeFlag}
              </span>
              <span className="font-display text-sm md:text-base font-black tracking-tight uppercase mt-2.5">
                {homeName}
              </span>
              {homeTeam && (
                <span className="font-mono text-[10px] text-ink/50 dark:text-paper/50">
                  RANK #{homeTeam.fifaRanking}
                </span>
              )}
            </div>

            {/* Score Center */}
            <div className="flex flex-col items-center w-2/12">
              <div className="font-display text-4xl md:text-5xl font-black tracking-tight flex items-center gap-1.5 tabular-nums">
                <span>{match.status === "scheduled" ? "-" : match.homeScore}</span>
                <span className="opacity-40">:</span>
                <span>{match.status === "scheduled" ? "-" : match.awayScore}</span>
              </div>
              {isLive && (
                <div className="mt-2.5 flex items-center gap-1 text-[10px] font-mono font-bold bg-stadium-red text-paper px-2.5 py-0.5 animate-pulse uppercase">
                  <span className="h-1 w-1 rounded-full bg-paper animate-pulse-dot"></span>
                  {match.status === "ht" ? "HT (Selesai)" : match.status === "pen" ? "Adu PK" : (match.minute ? `${match.minute}'` : "LIVE")}
                </div>
              )}
              {match.status === "ft" && (
                <div className="mt-2 text-[10px] font-mono font-bold border border-ink/20 dark:border-paper/20 px-2 py-0.5 uppercase tracking-wide bg-ink text-paper">
                  FT
                </div>
              )}
            </div>

            {/* Away */}
            <div className="flex flex-col items-center w-5/12 text-center">
              <span className="text-5xl md:text-6xl filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] select-none">
                {awayFlag}
              </span>
              <span className="font-display text-sm md:text-base font-black tracking-tight uppercase mt-2.5">
                {awayName}
              </span>
              {awayTeam && (
                <span className="font-mono text-[10px] text-ink/50 dark:text-paper/50">
                  RANK #{awayTeam.fifaRanking}
                </span>
              )}
            </div>
          </div>

          {/* Live Action button inside detail */}
          {isLive && onSimulateSingle && (
            <button
              onClick={() => onSimulateSingle(match.id)}
              className="mb-2.5 cursor-pointer border-2 border-ink bg-signal-yellow text-ink px-4 py-1.5 font-mono text-xs font-bold shadow-[2px_2px_0_#111] hover:bg-yellow-400 active:translate-y-1"
            >
              SIMULASIKAN MENIT BERIKUTNYA ⏱️
            </button>
          )}

          {/* Stadium Details */}
          <p className="font-mono text-xs text-ink/50 dark:text-paper/50 capitalize mt-2 select-none">
            🏟️ {venue?.stadiumName} • {venue?.city}, {venue?.country} {venue?.capacity && `• Kapasitas: ${venue.capacity}`}
          </p>
        </div>

        {/* TAB CONTROLLERS */}
        <div className="flex flex-wrap border-b-2 border-ink dark:border-paper mt-3 bg-paper dark:bg-paper-dark select-none">
          {[
            { id: "ringkasan", label: "Ringkasan Laga", icon: ClipboardList },
            { id: "lineup", label: "Line-Up Dasar", icon: Star },
            { id: "stats", label: "Statistik", icon: ClipboardList },
            { id: "klasemen", label: "Klasemen Terkait", icon: ListOrdered },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[110px] cursor-pointer py-2 px-2 text-center font-sans font-bold text-xs flex items-center justify-center gap-1.5 border-r border-ink/10 last:border-r-0 transition-colors ${
                  isTabActive
                    ? "bg-electric-blue text-paper"
                    : "hover:bg-signal-yellow hover:text-ink text-ink dark:text-paper"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TABS CONTENTS */}
        <div className="py-4">
          
          {/* 1. TIMELINE EVENTS SUMMARY */}
          {activeTab === "ringkasan" && (
            <div className="flex flex-col gap-3 min-h-[150px]">
              <h4 className="font-mono text-[11px] font-black uppercase text-ink/50 dark:text-paper/40 tracking-wider mb-2">
                Kronologi Kejadian Pertandingan
              </h4>
              <MatchTimeline 
                fixtureId={match.id} 
                matchStatus={match.status} 
                homeTeamId={match.homeTeamId} 
                awayTeamId={match.awayTeamId} 
              />
            </div>
          )}

          {/* 2. TAB LINEUP SCHEMATIC */}
          {activeTab === "lineup" && (
            <LineupView fixtureId={match.id} matchStatus={match.status} fixtureDate={(match as any).date || (match as any).local_date || match.kickoffUtc} />
          )}

          {/* 3. HARD STATS BAR */}
          {activeTab === "stats" && (
            <div className="flex flex-col gap-6">
              
              {isLoadingStats ? (
                <div className="text-center py-6 font-mono text-xs animate-pulse opacity-60">Memuat Statistik Real-Time...</div>
              ) : (
                renderStatsBars()
              )}
            </div>
          )}

          {/* 4. RELATED STANDINGS TABLE */}
          {activeTab === "klasemen" && (
            <div>
              {match.stage === "group" && match.group ? (
                <div>
                  <h4 className="font-mono text-xs font-black uppercase tracking-wider mb-2 select-none">
                    Klasemen Sementara Grup {match.group}
                  </h4>
                  {homeTeam && (
                    <div className="border border-ink rounded-none overflow-hidden">
                      {/* Sub table display */}
                      <table className="w-full text-xs">
                        <thead className="bg-ink text-paper font-mono uppercase text-[9px]">
                          <tr>
                            <th className="py-1 px-2 text-center w-8">POS</th>
                            <th className="py-1 px-2">TIM</th>
                            <th className="py-1 px-1 text-center w-10">MAIN</th>
                            <th className="py-1 px-1 text-center w-10">SG</th>
                            <th className="py-1 px-2 text-center w-12 font-black">PTS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {calculateStandings(match.group, teams, matches).map((row, idx) => {
                            const tInfo = teams.find((t) => t.id === row.teamId);
                            const isMatchTeam = row.teamId === match.homeTeamId || row.teamId === match.awayTeamId;
                            return (
                              <tr
                                key={row.teamId}
                                className={`border-b border-ink/10 ${
                                  isMatchTeam ? "bg-signal-yellow text-ink font-bold" : "text-ink/80 dark:text-paper"
                                }`}
                              >
                                <td className="py-1.5 px-2 text-center font-mono font-bold">{idx + 1}</td>
                                <td className="py-1.5 px-2 font-display uppercase tracking-tight text-[11px]">
                                  {COUNTRY_FLAG_EMOJIS[tInfo?.flagCode || ""] || "🏳️"} {tInfo?.name}
                                </td>
                                <td className="py-1.5 px-1 text-center font-mono">{row.played}</td>
                                <td className="py-1.5 px-1 text-center font-mono">{row.goalDiff}</td>
                                <td className="py-1.5 px-2 text-center font-mono font-black">{row.points}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 font-mono text-xs text-ink/50 select-none">
                  ℹ️ Laga babak fase gugur tidak memiliki klasemen grup terkait.
                </div>
              )}
            </div>
          )}

        </div>
      </div>
      <ApiQuotaBadge />
    </div>
  );
}
