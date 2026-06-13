import { Match, Team } from "../types";
import { COUNTRY_FLAG_EMOJIS, PLACEHOLDER_NAMES } from "../data";

interface BaganBracketProps {
  matches: Match[];
  teams: Team[];
  onClickMatch: (matchId: string) => void;
}

export default function BaganBracket({ matches, teams, onClickMatch }: BaganBracketProps) {
  // filter matches by knockout stages
  const getMatchesForStage = (stage: Match["stage"]) => {
    return matches.filter((m) => m.stage === stage);
  };

  const stages: { id: Match["stage"]; label: string; color: string }[] = [
    { id: "round32", label: "32 BESAR", color: "bg-ink" },
    { id: "round16", label: "16 BESAR", color: "bg-ink" },
    { id: "qf", label: "PEREMPAT FINAL", color: "bg-ink" },
    { id: "sf", label: "SEMIFINAL", color: "bg-ink" },
    { id: "final", label: "FINAL PIALA DUNIA", color: "bg-electric-blue" },
  ];

  const renderMatchNode = (match: Match) => {
    const homeTeam = teams.find((t) => t.id === match.homeTeamId);
    const awayTeam = teams.find((t) => t.id === match.awayTeamId);

    const homeName = homeTeam ? homeTeam.name : PLACEHOLDER_NAMES[match.homeTeamId] || match.homeTeamId;
    const awayName = awayTeam ? awayTeam.name : PLACEHOLDER_NAMES[match.awayTeamId] || match.awayTeamId;

    const homeFlag = homeTeam?.flagUrl ? <img src={homeTeam.flagUrl} alt="" className="h-3 w-4 border border-ink/20 object-cover" /> : (homeTeam ? COUNTRY_FLAG_EMOJIS[homeTeam.flagCode] || "🏳️" : "🔮");
    const awayFlag = awayTeam?.flagUrl ? <img src={awayTeam.flagUrl} alt="" className="h-3 w-4 border border-ink/20 object-cover" /> : (awayTeam ? COUNTRY_FLAG_EMOJIS[awayTeam.flagCode] || "🏳️" : "🔮");

    const isHomeWinner = match.status === "ft" && (match.homeScore > match.awayScore || (match.penaltyHomeScore || 0) > (match.penaltyAwayScore || 0));
    const isAwayWinner = match.status === "ft" && (match.awayScore > match.homeScore || (match.penaltyAwayScore || 0) > (match.penaltyHomeScore || 0));

    return (
      <div
        key={match.id}
        onClick={() => onClickMatch(match.id)}
        className="cursor-pointer border-3 border-ink dark:border-paper bg-paper dark:bg-paper-dark p-2 w-[220px] shadow-[4px_4px_0_var(--color-ink)] dark:shadow-[4px_4px_0_var(--color-paper)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_var(--color-ink)] transition-all select-none"
      >
        <div className="text-[9px] font-mono font-bold text-ink/50 dark:text-paper/40 border-b border-dashed border-ink/10 pb-0.5 mb-1 flex items-center justify-between">
          <span>{match.id.toUpperCase()}</span>
          {match.status === "live" && <span className="text-stadium-red animate-pulse">● LIVE</span>}
        </div>

        {/* Home Row */}
        <div className={`flex items-center justify-between py-1 px-1 rounded-sm ${isHomeWinner ? "bg-azteca-green/10 font-bold" : ""}`}>
          <div className="flex items-center gap-2 overflow-hidden w-[140px]">
            <span className="text-base leading-none">{homeFlag}</span>
            <span className="text-xs font-sans tracking-tight truncate uppercase leading-none">{homeName}</span>
          </div>
          <span className="font-mono text-xs font-black">
            {match.status === "scheduled" ? "-" : match.homeScore}
            {match.penaltyHomeScore !== undefined && <span className="text-[10px] text-stadium-red pl-0.5">({match.penaltyHomeScore})</span>}
          </span>
        </div>

        {/* Away Row */}
        <div className={`flex items-center justify-between py-1 px-1 rounded-sm mt-1.5 ${isAwayWinner ? "bg-azteca-green/10 font-bold" : ""}`}>
          <div className="flex items-center gap-2 overflow-hidden w-[140px]">
            <span className="text-base leading-none">{awayFlag}</span>
            <span className="text-xs font-sans tracking-tight truncate uppercase leading-none">{awayName}</span>
          </div>
          <span className="font-mono text-xs font-black">
            {match.status === "scheduled" ? "-" : match.awayScore}
            {match.penaltyAwayScore !== undefined && <span className="text-[10px] text-stadium-red pl-0.5">({match.penaltyAwayScore})</span>}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-paper dark:bg-paper-dark border-4 border-ink dark:border-paper p-4 md:p-6 shadow-[6px_6px_0_var(--color-ink)] dark:shadow-[6px_6px_0_var(--color-paper)] transition-all overflow-hidden">
      
      {/* Title */}
      <h3 className="font-display text-xl uppercase tracking-tight mb-1 text-ink dark:text-paper">
        BAGAN FASE GUGUR PIALA DUNIA 2026
      </h3>
      <p className="font-mono text-xs text-ink/60 dark:text-paper/60 mb-6 border-b border-ink/10 pb-3">
        FORMAT FORMAT BARU 48 TIM • DARI BABAK 32 BESAR HINGGA MAHKOTA JUARA DI NEW YORK NEW JERSEY
      </p>

      {/* Horizontal bracket scrollable map layout */}
      <div className="overflow-x-auto pb-6 scrollbar-none">
        <div className="flex gap-12 items-start min-w-[1300px] px-2 py-4 relative">
          
          {/* Column Stages mapper */}
          {stages.map((stageInfo) => {
            const stageMatches = getMatchesForStage(stageInfo.id);
            return (
              <div key={stageInfo.id} className="flex flex-col gap-6 flex-shrink-0 w-[220px]">
                {/* Column header title badge */}
                <div className={`border-2 border-ink text-center py-2 px-3 shadow-[2px_2px_0_var(--color-ink)] ${stageInfo.color} text-paper`}>
                  <h4 className="font-display text-xs tracking-wider uppercase">
                    {stageInfo.label}
                  </h4>
                  <span className="font-mono text-[9px] text-paper/60 leading-none">
                    {stageMatches.length} LAGA
                  </span>
                </div>

                {/* Vertical column alignment of match nodes */}
                <div className="flex flex-col h-[700px] justify-around">
                  {stageMatches.map((match) => renderMatchNode(match))}
                </div>
              </div>
            );
          })}

          {/* Column additional for Juara 3 */}
          <div className="flex flex-col gap-6 flex-shrink-0 w-[220px]">
            <div className="border-2 border-ink text-center py-2 px-3 shadow-[2px_2px_0_var(--color-ink)] bg-stadium-red text-paper">
              <h4 className="font-display text-xs tracking-wider uppercase">
                JUARA KETIGA
              </h4>
              <span className="font-mono text-[9px] text-paper/60 leading-none">
                PEREBUTAN MEDALI PERUNGGU
              </span>
            </div>

            <div className="flex flex-col h-[700px] justify-center items-center">
              {getMatchesForStage("3rd").map((match) => renderMatchNode(match))}
            </div>
          </div>

        </div>
      </div>

      <div className="text-center font-mono text-[11px] text-ink/50 dark:text-paper/40 mt-2 select-none border-t border-dashed border-ink/20 pt-2.5">
        💡 Tap salah satu pertandingan babak gugur di atas untuk melihat detail stadion, formasi taktis, dan jalannya laga!
      </div>
    </div>
  );
}
