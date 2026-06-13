import { useMatchEvents } from "../hooks/useApiFootball";

interface MatchTimelineProps {
  fixtureId: string;
  matchStatus?: string;
  homeTeamId: string;
  awayTeamId: string;
}

export function MatchTimeline({ fixtureId, matchStatus, homeTeamId, awayTeamId }: MatchTimelineProps) {
  const { data: events, isLoading } = useMatchEvents(fixtureId, matchStatus);

  if (isLoading) {
    return <div className="text-center py-6 font-mono text-xs animate-pulse opacity-60">Memuat Kronologi Kejadian...</div>;
  }

  if (events === null) {
    return <div className="text-center font-sans py-12 text-ink/50 dark:text-paper/50 font-medium">Data event tidak tersedia untuk pertandingan ini.</div>;
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center font-sans py-12 text-ink/50 dark:text-paper/50 font-medium">
        🕒 {matchStatus === 'scheduled' ? "Laga belum dimulai." : "Belum ada kejadian penting tercatat."}
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-r-2 border-ink dark:border-paper bg-paper dark:bg-paper-dark p-4">
      {/* Center Line for Timeline */}
      <div className="absolute left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-ink/10 dark:bg-paper/10" />

      <div className="flex flex-col gap-3">
        {events.map((ev: any, i: number) => {
          const isHome = String(ev.team.id) === homeTeamId;
          const evTime = ev.time.elapsed + (ev.time.extra ? `+${ev.time.extra}` : "");

          const IconBox = () => {
             let icon = "⏱️";
             let label = "";

             if (ev.type === "Goal") {
                if (ev.detail === "Own Goal") {
                   icon = "⚽"; label = "Gol Bunuh Diri";
                } else if (ev.detail === "Penalty") {
                   icon = "⚽"; label = "Penalti";
                } else if (ev.detail === "Missed Penalty") {
                   icon = "❌"; label = "Penalti Gagal";
                } else {
                   icon = "⚽"; label = "Gol";
                }
             } else if (ev.type === "Card") {
                if (ev.detail === "Yellow Card") { icon = "🟨"; label = "Kartu Kuning"; }
                else { icon = "🟥"; label = "Kartu Merah"; }
             } else if (ev.type === "subst") {
                icon = "🔄"; label = "Pergantian";
             } else if (ev.type === "Var") {
                icon = "📺"; label = "VAR";
             }

             return (
               <div className="flex flex-col items-center gap-0.5">
                  <span className="text-sm">{icon}</span>
                  {label && <span className="text-[8px] font-mono text-ink/60 uppercase">{label}</span>}
               </div>
             )
          };

          return (
            <div key={i} className="flex relative w-full">
               {/* Center Time Badge */}
               <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-6 font-mono font-black border-2 border-ink dark:border-paper bg-signal-yellow text-ink text-[10px] flex items-center justify-center">
                 {evTime}'
               </div>

               {/* Home Side */}
               <div className={`w-1/2 flex items-center justify-end pr-8 ${!isHome ? 'opacity-0 invisible' : ''}`}>
                 <div className="flex items-center gap-3 text-right">
                    <div className="flex flex-col items-end">
                       <span className="font-bold text-xs uppercase">{ev.player?.name}</span>
                       {ev.type === "subst" && ev.assist?.name && (
                         <span className="text-[10px] text-ink/60 line-through">{ev.assist.name}</span>
                       )}
                       {ev.type === "Var" && ev.comments && (
                         <span className="text-[10px] text-ink/60 italic">{ev.comments}</span>
                       )}
                    </div>
                    <IconBox />
                 </div>
               </div>

               {/* Away Side */}
               <div className={`w-1/2 flex items-center justify-start pl-8 ${isHome ? 'opacity-0 invisible' : ''}`}>
                 <div className="flex items-center gap-3 text-left">
                    <IconBox />
                    <div className="flex flex-col items-start">
                       <span className="font-bold text-xs uppercase">{ev.player?.name}</span>
                       {ev.type === "subst" && ev.assist?.name && (
                         <span className="text-[10px] text-ink/60 line-through">{ev.assist.name}</span>
                       )}
                       {ev.type === "Var" && ev.comments && (
                         <span className="text-[10px] text-ink/60 italic">{ev.comments}</span>
                       )}
                    </div>
                 </div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
