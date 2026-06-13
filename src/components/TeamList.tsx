import { useState } from "react";
import { Team, Match, Venue } from "../types";
import { COUNTRY_FLAG_EMOJIS, PLACEHOLDER_NAMES } from "../data";
import { useTeamDetails } from "../hooks/useTeamDetails";

interface TeamListProps {
  teams: Team[];
  matches: Match[];
  venues: Venue[];
  onToggleFavorite: (id: string) => void;
  favorites: string[];
  selectedTeamIdInit?: string | null;
  onClearSelectedTeam?: () => void;
}

export default function TeamList({
  teams,
  matches,
  venues,
  onToggleFavorite,
  favorites,
  selectedTeamIdInit,
  onClearSelectedTeam,
}: TeamListProps) {
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>("ALL");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(
    selectedTeamIdInit ? teams.find((t) => t.id === selectedTeamIdInit) || null : null
  );

  const { data: teamDetails, isLoading: isTeamDetailsLoading } = useTeamDetails(selectedTeam?.id || null);

  const groups = ["ALL", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

  const filteredTeams = selectedGroupFilter === "ALL"
    ? teams
    : teams.filter((t) => t.group === selectedGroupFilter);

  // When parent triggers opening a team
  if (selectedTeamIdInit && (!selectedTeam || selectedTeam.id !== selectedTeamIdInit)) {
    const found = teams.find((t) => t.id === selectedTeamIdInit);
    if (found) {
      setSelectedTeam(found);
    }
  }

  // Get fixtures for the selected team
  const getTeamFixtures = (teamId: string) => {
    return matches.filter((m) => m.homeTeamId === teamId || m.awayTeamId === teamId);
  };

  const handleCloseDetail = () => {
    setSelectedTeam(null);
    if (onClearSelectedTeam) onClearSelectedTeam();
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. MAIN DIRECTORY OF TEAMS */}
      {!selectedTeam ? (
        <div className="w-full bg-paper dark:bg-paper-dark border-4 border-ink dark:border-paper p-4 md:p-6 shadow-[6px_6px_0_var(--color-ink)] dark:shadow-[6px_6px_0_var(--color-paper)] transition-all">
          <h3 className="font-display text-xl uppercase tracking-tight mb-2 text-ink dark:text-paper">
            DIREKTORI 48 NEGARA KLASEMEN
          </h3>
          <p className="font-mono text-xs text-ink/60 dark:text-paper/60 mb-6 border-b border-ink/15 pb-2 uppercase">
            Saring berdasarkan grup untuk memantau skuad, pelatih, ranking & rincian timnas
          </p>

          {/* Group scroll selector chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-4 scrollbar-none select-none">
            {groups.map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroupFilter(group)}
                className={`cursor-pointer px-3.5 py-1.5 border-2 border-ink text-xs font-display font-black shadow-[1px_1px_0_#111] transition-all flex-shrink-0 ${
                  selectedGroupFilter === group
                    ? "bg-electric-blue text-paper translate-y-[-1px] shadow-[2px_2px_0_#111]"
                    : "bg-paper dark:bg-paper-dark hover:bg-signal-yellow text-ink dark:text-paper hover:text-ink"
                }`}
              >
                {group === "ALL" ? "SEMUA" : `GRUP ${group}`}
              </button>
            ))}
          </div>

          {/* Teams Grid List */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-2">
            {filteredTeams.map((team) => {
              const flag = team.flagUrl ? <img src={team.flagUrl} alt="" className="h-10 w-16 object-cover mx-auto" /> : (COUNTRY_FLAG_EMOJIS[team.flagCode] || "🏳️");
              const isFav = favorites.includes(team.id);

              return (
                <div
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className="cursor-pointer border-3 border-ink bg-paper dark:bg-paper-dark p-3 text-center shadow-[3px_3px_0_var(--color-ink)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_var(--color-ink)] transition-all relative select-none uppercase"
                >
                  {/* Top floating group/rank label code */}
                  <div className="flex justify-between items-center text-[9px] font-mono font-bold text-ink/50 dark:text-paper/40 mb-1.5">
                    <span>GRUP {team.group}</span>
                    <span>#{team.fifaRanking}</span>
                  </div>

                  {/* Flag and name */}
                  <div className="text-3xl my-2 filter drop-shadow-md flex justify-center">{flag}</div>
                  <h4 className="font-display text-xs md:text-sm font-black tracking-tight leading-tight mb-2 max-w-full truncate text-ink dark:text-paper">
                    {team.name}
                  </h4>

                  {/* Favorite button */}
                  <div className="flex justify-center border-t border-dashed border-ink/10 pt-2 text-[11px] font-mono">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(team.id);
                      }}
                      className="cursor-pointer bg-black/5 hover:bg-signal-yellow p-1 rounded-none hover:text-ink"
                      title="Sukai Tim Ini"
                    >
                      {isFav ? "❤️ FAVORIT" : "🤍 TAMBAH"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        
        // 2. DETAILED SINGLE TEAM PROFILE VIEW OVERLAY
        <div className="w-full bg-paper dark:bg-paper-dark border-4 border-ink p-4 md:p-6 shadow-[8px_8px_0_var(--color-ink)] transition-all animate-fade-in relative text-ink dark:text-paper select-none">
          
          {/* Back to directory list */}
          <button
            onClick={handleCloseDetail}
            className="mb-4 cursor-pointer border-2 border-ink bg-paper hover:bg-signal-yellow text-ink px-3 py-1 font-mono text-xs font-bold shadow-[2px_2px_0_#111] active:translate-y-0.5"
          >
            ⬅️ KEMBALI KE DIREKTORI
          </button>

          {/* Header Profile Info card */}
          <div className="border-4 border-ink bg-signal-yellow text-ink p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[4px_4px_0_#111] mb-6 rounded-none">
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <span className="text-6xl md:text-7xl filter drop-shadow-md select-none flex justify-center">
                {selectedTeam.flagUrl ? <img src={selectedTeam.flagUrl} alt="" className="h-16 w-24 object-cover border-4 border-ink/20" /> : COUNTRY_FLAG_EMOJIS[selectedTeam.flagCode]}
              </span>
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-black tracking-tight uppercase leading-none">
                  {selectedTeam.name}
                </h3>
                <p className="font-mono text-xs font-bold uppercase mt-1 text-ink/70">
                  GRUP {selectedTeam.group} • PELATIH (COACH): {
                    isTeamDetailsLoading ? "MEMUAT..." : (teamDetails?.data?.coach || teamDetails?.coach || selectedTeam.coach || "-")
                  }
                </p>
              </div>
            </div>

            <div className="flex gap-4 md:gap-6 border-t md:border-t-0 md:border-l border-ink/20 pt-3 md:pt-0 pl-0 md:pl-6 text-center">
              <div>
                <span className="block font-display text-2xl uppercase font-black tracking-tight">
                  #{isTeamDetailsLoading ? "..." : (teamDetails?.data?.fifa_ranking || teamDetails?.fifa_ranking || selectedTeam.fifaRanking)}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase block tracking-wider text-ink/60">
                  RANKING FIFA
                </span>
              </div>
              <div>
                <span className="block font-display text-2xl uppercase font-black tracking-tight">
                  {isTeamDetailsLoading ? "..." : (teamDetails?.data?.squad || teamDetails?.squad || teamDetails?.data?.players || teamDetails?.players || selectedTeam.squad || []).length}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase block tracking-wider text-ink/60">
                  PEMAIN SKUAD
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left side: Roster Skuad players */}
            <div className="lg:col-span-7 border-2 border-ink dark:border-paper p-4 bg-paper dark:bg-paper-dark">
              <h4 className="font-display text-sm border-b-2 border-ink pb-2 mb-3 tracking-wide uppercase flex items-center justify-between">
                <span>📋 SKUAD RESMI PIALA DUNIA</span>
                <span className="font-mono text-[10px] uppercase font-bold text-ink/50">ROSTER</span>
              </h4>
              <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto">
                {isTeamDetailsLoading ? (
                   <div className="p-4 text-center text-xs font-mono font-bold animate-pulse">Menghubungkan ke server Live API untuk Skuad...</div>
                ) : (
                  (teamDetails?.data?.squad || teamDetails?.squad || teamDetails?.data?.players || teamDetails?.players || selectedTeam.squad || []).map((player: any) => (
                    <div
                      key={player.id || player._id || player.name}
                      className="flex items-center justify-between font-sans border border-ink/5 dark:border-paper/5 hover:bg-black/5 dark:hover:bg-white/5 p-1.5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 border-2 border-ink font-mono font-black text-xs text-center bg-signal-yellow text-ink flex items-center justify-center select-none">
                          {player.shirtNumber || player.number || "-"}
                        </span>
                        <span className="font-bold uppercase tracking-tight text-xs md:text-sm">{player.name || player.name_en || "Pemain"}</span>
                      </div>
                      <div className="flex gap-3 items-center">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 border border-ink/10 bg-black/5 dark:bg-white/10 uppercase">
                          {player.position || "POS"}
                        </span>
                        <span className="hidden sm:inline font-mono text-[10px] text-ink/40 dark:text-paper/40 truncate max-w-[110px]">
                          {player.club || "-"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right side: Fixtures and schedules for this team */}
            <div className="lg:col-span-5 border-2 border-ink dark:border-paper p-4 bg-paper dark:bg-paper-dark">
              <h4 className="font-display text-sm border-b-2 border-ink pb-2 mb-3 tracking-wide uppercase">
                📅 FIXTURES & JADWAL TIM
              </h4>
              <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
                {getTeamFixtures(selectedTeam.id).map((match) => {
                  const opp = match.homeTeamId === selectedTeam.id
                    ? teams.find(t => t.id === match.awayTeamId)
                    : teams.find(t => t.id === match.homeTeamId);

                  const oppFlag = opp?.flagUrl ? <img src={opp.flagUrl} alt="" className="h-4 w-6 object-cover border border-ink/20" /> : (opp ? COUNTRY_FLAG_EMOJIS[opp.flagCode] || "🏳️" : "🔮");
                  const isOppHome = match.awayTeamId === selectedTeam.id;

                  const kickoffDate = new Date(match.kickoffUtc);
                  const days = ["MNG", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
                  const dayName = days[kickoffDate.getDay()];
                  const dDate = kickoffDate.getDate();
                  const mName = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"][kickoffDate.getMonth()];

                  return (
                    <div
                      key={match.id}
                      className="border-2 border-ink p-2.5 font-mono text-xs flex flex-col gap-1.5 bg-paper text-ink"
                    >
                      <div className="flex justify-between items-center text-[10px] text-ink/60 border-b border-dashed border-ink/10 pb-1">
                        <span>{match.stage === "group" ? `GRUP ${match.group || ""} STAGE` : "BABAK GUGUR"}</span>
                        <span>{dayName}, {dDate} {mName}</span>
                      </div>
                      <div className="flex justify-between items-center font-bold">
                        <span className="flex items-center gap-1.5 uppercase font-display text-[11px]">
                          <span>{isOppHome ? "✈️ VS" : "🏠 VS"}</span>
                          <span>{oppFlag}</span>
                          <span className="truncate max-w-[110px]">{opp ? opp.name : PLACEHOLDER_NAMES[match.homeTeamId] || "Lawan"}</span>
                        </span>

                        {/* Match score states or hours */}
                        {match.status === "scheduled" ? (
                          <span className="bg-electric-blue text-paper px-2 py-0.5 rounded-none font-bold">
                            {String(kickoffDate.getHours()).padStart(2, "0")}:{String(kickoffDate.getMinutes()).padStart(2, "0")} WIB
                          </span>
                        ) : (
                          <span className={`font-display text-[13px] font-black px-1.5 py-0.5 rounded-none ${
                            match.status === "live" ? "bg-stadium-red text-paper" : "bg-ink/5"
                          }`}>
                            {match.homeTeamId === selectedTeam.id ? `${match.homeScore}-${match.awayScore}` : `${match.awayScore}-${match.homeScore}`}
                            {match.status === "live" && " (LIVE)"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
