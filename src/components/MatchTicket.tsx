import { Match, Team, Venue } from "../types";
import { COUNTRY_FLAG_EMOJIS, PLACEHOLDER_NAMES } from "../data";

interface MatchTicketProps {
  key?: string;
  match: Match;
  teams: Team[];
  venues: Venue[];
  isFavoriteHome: boolean;
  isFavoriteAway: boolean;
  onToggleFavorite: (teamId: string) => void;
  onClickDetails: (matchId: string) => void;
  onSimulateSingle?: (matchId: string) => void;
}

export default function MatchTicket({
  match,
  teams,
  venues,
  isFavoriteHome,
  isFavoriteAway,
  onToggleFavorite,
  onClickDetails,
  onSimulateSingle,
}: MatchTicketProps) {
  const homeTeam = teams.find((t) => t.id === match.homeTeamId);
  const awayTeam = teams.find((t) => t.id === match.awayTeamId);
  const venue = venues.find((v) => v.id === match.venueId);

  const homeName = homeTeam ? homeTeam.name : PLACEHOLDER_NAMES[match.homeTeamId] || match.homeTeamId;
  const awayName = awayTeam ? awayTeam.name : PLACEHOLDER_NAMES[match.awayTeamId] || match.awayTeamId;

  const homeFlag = homeTeam?.flagUrl ? <img src={homeTeam.flagUrl} alt="" className="h-6 w-9 object-cover border border-ink/20" /> : (homeTeam ? COUNTRY_FLAG_EMOJIS[homeTeam.flagCode] || "🏳️" : "🔮");
  const awayFlag = awayTeam?.flagUrl ? <img src={awayTeam.flagUrl} alt="" className="h-6 w-9 object-cover border border-ink/20" /> : (awayTeam ? COUNTRY_FLAG_EMOJIS[awayTeam.flagCode] || "🏳️" : "🔮");

  const isLive = match.status === "live" || match.status === "ht" || match.status === "et" || match.status === "pen";
  const isFT = match.status === "ft";

  // Formatter for kick-off time in WIB
  const formatKickoffWIB = (isoString: string) => {
    try {
      const date = new Date(isoString);
      // WIB is UTC+7
      const localHours = String(date.getHours()).padStart(2, "0");
      const localMins = String(date.getMinutes()).padStart(2, "0");
      const localDay = date.getDate();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      const localMonth = monthNames[date.getMonth()];
      return {
        time: `${localHours}:${localMins}`,
        date: `${localDay} ${localMonth}`,
      };
    } catch {
      return { time: "00:00", date: "11 Jun" };
    }
  };

  const kickoff = formatKickoffWIB(match.kickoffUtc);

  // Colors based on Status state in design.md spec
  let stubClass = "bg-paper dark:bg-paper-dark dark:text-paper";
  let borderCardClass = "border-ink dark:border-paper";
  let shadowCardClass = "shadow-[6px_6px_0_var(--color-ink)] dark:shadow-[6px_6px_0_var(--color-paper)]";

  if (isLive) {
    stubClass = "bg-stadium-red text-paper dark:text-paper";
    shadowCardClass = "shadow-[6px_6px_0_var(--color-electric-blue)] scale-[1.01]";
  } else if (isFT) {
    stubClass = "bg-line-gray text-ink/70 dark:bg-paper-dark dark:text-paper/50";
  }

  // Stage labeling (e.g. "GRUP B • MATCH 14")
  const stageLabels: Record<string, string> = {
    group: `GRUP ${match.group || ""} • LAGA KELOMPOK`,
    round32: "BABAK 32 BESAR",
    round16: "BABAK 16 BESAR",
    qf: "PEREMPAT FINAL (QF)",
    sf: "SEMIFINAL (SF)",
    "3rd": "PEREBUTAN JUARA 3",
    final: "FINAL PIALA DUNIA",
  };

  return (
    <div
      onClick={() => onClickDetails(match.id)}
      className={`relative flex flex-row items-stretch w-full border-4 ${borderCardClass} ${shadowCardClass} cursor-pointer hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_var(--color-ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_var(--color-ink)] dark:hover:shadow-[8px_8px_0_var(--color-paper)] transition-all bg-paper dark:bg-paper-dark text-ink dark:text-paper rounded-none select-none`}
    >
      {/* LEFT SECTION: MAIN MATCH INFO (~75%) */}
      <div className="flex-1 p-3 md:p-4 flex flex-col justify-between overflow-hidden">
        {/* Top Info line */}
        <div className="flex items-center justify-between font-mono text-[11px] font-bold text-ink/60 dark:text-paper/60 uppercase tracking-widest border-b border-dashed border-ink/20 dark:border-paper/20 pb-1.5 mb-2">
          <span>{stageLabels[match.stage]}</span>
          {venue && (
            <span className="hidden sm:inline font-mono">
              📍 {venue.city.toUpperCase()}
            </span>
          )}
        </div>

        {/* Home & Away team flags, names, and scores */}
        <div className="flex flex-col gap-2.5 my-1.5">
          {/* HOME TEAM ROW */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="text-2xl shadow-sm filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] flex-shrink-0">
                {homeFlag}
              </span>
              <span className="font-display text-sm md:text-base tracking-tight truncate uppercase font-extrabold max-w-[140px] md:max-w-xs">
                {homeName}
              </span>
              {homeTeam && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(homeTeam.id);
                  }}
                  className={`p-1 leading-none rounded-none hover:bg-ink/5 dark:hover:bg-paper/5 text-sm transition-all`}
                  title="Favoritkan Tim"
                >
                  {isFavoriteHome ? "❤️" : "🤍"}
                </button>
              )}
            </div>
            <div className="flex-shrink-0 font-mono text-xl md:text-2xl font-bold px-2 py-0.5 border border-ink/10 dark:border-paper/10 bg-mono-sub bg-black/5 dark:bg-white/5 tracking-tighter rounded-sm">
              {match.status === "scheduled" ? "-" : match.homeScore}
            </div>
          </div>

          {/* AWAY TEAM ROW */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="text-2xl shadow-sm filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] flex-shrink-0">
                {awayFlag}
              </span>
              <span className="font-display text-sm md:text-base tracking-tight truncate uppercase font-extrabold max-w-[140px] md:max-w-xs">
                {awayName}
              </span>
              {awayTeam && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(awayTeam.id);
                  }}
                  className={`p-1 leading-none rounded-none hover:bg-ink/5 dark:hover:bg-paper/5 text-sm transition-all`}
                  title="Favoritkan Tim"
                >
                  {isFavoriteAway ? "❤️" : "🤍"}
                </button>
              )}
            </div>
            <div className="flex-shrink-0 font-mono text-xl md:text-2xl font-bold px-2 py-0.5 border border-ink/10 dark:border-paper/10 bg-mono-sub bg-black/5 dark:bg-white/5 tracking-tighter rounded-sm">
              {match.status === "scheduled" ? "-" : match.awayScore}
            </div>
          </div>
        </div>

        {/* Penalty details if penalty stage occurred */}
        {match.status === "ft" && match.penaltyHomeScore !== undefined && match.penaltyAwayScore !== undefined && (
          <div className="font-mono text-[10px] md:text-xs text-center border-t border-dotted border-ink/20 dark:border-paper/20 pt-1 mt-1 text-stadium-red font-bold">
            ADU PENALTI: {match.penaltyHomeScore} - {match.penaltyAwayScore}
          </div>
        )}

        {/* Bottom Venue/Time info */}
        <div className="mt-2.5 pt-2 flex items-center justify-between text-[11px] font-mono text-ink/50 dark:text-paper/40 font-semibold tracking-wide">
          <span className="truncate">🏟️ {venue ? venue.stadiumName : "Stadion Host"}</span>
          <span className="flex-shrink-0 font-bold ml-1 text-ink dark:text-paper">WIB</span>
        </div>
      </div>

      {/* DASHED SEPARATOR/PERFORATION LINE (25%) */}
      <div className="relative w-0.5 border-l-2 border-dashed border-ink/40 dark:border-paper/40 flex-shrink-0 self-stretch my-2 z-10">
        {/* Top ticket coupon notch */}
        <div className="absolute top-[-14px] left-[-7px] w-3 h-3 rounded-full bg-paper dark:bg-paper-dark border-b border-ink/40 dark:border-paper/40 flex items-center justify-center"></div>
        {/* Bottom ticket coupon notch */}
        <div className="absolute bottom-[-14px] left-[-7px] w-3 h-3 rounded-full bg-paper dark:bg-paper-dark border-t border-ink/40 dark:border-paper/40 flex items-center justify-center"></div>
      </div>

      {/* RIGHT SECTION: STUB STATUS (~25%) */}
      <div className={`w-[85px] md:w-[105px] flex-shrink-0 flex flex-col items-center justify-center text-center p-2 relative font-mono overflow-hidden ${stubClass}`}>
        
        {/* Live dynamic ticking animation vs static time */}
        {isLive && (
          <div className="flex flex-col items-center gap-1.5 w-full">
            <span className="flex items-center gap-1 bg-ink text-paper px-2 py-0.5 font-bold text-[9px] uppercase tracking-wider animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-stadium-red animate-pulse-dot"></span>
              {match.status === "ht" ? "HT" : match.status === "et" ? "ET" : match.status === "pen" ? "PEN" : "LIVE"}
            </span>
            <span className="text-xl md:text-2xl font-display leading-tight tracking-tighter">
              {match.status === "ht" ? "45'" : match.status === "pen" ? "PK" : (match.minute ? `${match.minute}'` : "LIVE")}
            </span>
            {onSimulateSingle && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSimulateSingle(match.id);
                }}
                className="mt-1 cursor-pointer border border-ink bg-signal-yellow text-ink px-1.5 py-0.5 rounded-none font-mono text-[9px] font-bold tracking-tighter active:scale-95"
              >
                TICK ⏱️
              </button>
            )}
          </div>
        )}

        {/* Scheduled upcoming match state */}
        {match.status === "scheduled" && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-ink/50 dark:text-paper/50">KICKOFF</span>
            <span className="text-base md:text-lg font-display tracking-tighter font-extrabold text-electric-blue dark:text-signal-yellow">
              {kickoff.time}
            </span>
            <span className="text-[10px] font-bold text-ink/70 dark:text-paper/70">
              {kickoff.date}
            </span>
            {onSimulateSingle && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSimulateSingle(match.id);
                }}
                className="mt-2 cursor-pointer border border-ink bg-azteca-green text-paper px-1.5 py-0.5 text-[9px] font-bold tracking-tight rounded-none shadow-[1px_1px_0_var(--color-ink)]"
              >
                SIMULATE
              </button>
            )}
          </div>
        )}

        {/* Full-time complete status with stamp element in Design spec section 6 */}
        {isFT && (
          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-[11px] font-black uppercase text-ink/40 dark:text-paper/40 tracking-wider">SELESAI</span>
            
            {/* Stamp Element rotated at -8deg miring */}
            <div className="absolute rotate-[-8deg] border-2 border-ink bg-stadium-red/10 text-stadium-red font-display text-[10px] md:text-xs px-1 py-0.5 uppercase tracking-widest tracking-tight font-black leading-none opacity-80 shadow-sm border-double pointer-events-none mt-4">
              FULL TIME
            </div>
          </div>
        )}

        {/* Postponed status */}
        {match.status === "postponed" && (
          <div className="flex flex-col items-center py-2 text-stadium-red font-bold text-xs uppercase tracking-tight">
            DITUNDA
          </div>
        )}
      </div>
    </div>
  );
}
