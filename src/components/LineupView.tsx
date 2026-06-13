import { useMatchLineup } from "../hooks/useApiFootball";

interface LineupViewProps {
  fixtureId: string;
  matchStatus?: string;
  fixtureDate?: string;
}

export function LineupView({ fixtureId, matchStatus, fixtureDate }: LineupViewProps) {
  const { data: lineups, isLoading } = useMatchLineup(fixtureId, matchStatus, fixtureDate);

  if (isLoading) {
    return <div className="text-center py-6 font-mono text-xs animate-pulse opacity-60">Memuat Lineup...</div>;
  }

  if (lineups === null) {
    return <div className="text-center py-6 font-sans text-sm opacity-60">Data lineup tidak tersedia untuk pertandingan ini</div>;
  }

  if (!lineups || lineups.length < 2) {
    return <div className="text-center py-6 font-sans text-sm opacity-60">Line-up belum dirilis</div>;
  }

  const [home, away] = lineups;

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Home Lineup */}
      <TeamLineup team={home} isHome={true} />
      
      {/* Away Lineup */}
      <TeamLineup team={away} isHome={false} />
    </div>
  );
}

function TeamLineup({ team, isHome }: { team: any; isHome: boolean }) {
  // Map grid strictly to positions if needed, or simply render
  // Let's create a pitch representation.
  // The grid is "Row:Col". Usually "1:1" is Goalkeeper
  // Rows can go up to 5 (e.g., 5-4-1 or 4-3-3: 1:1 GK, 2:4 Def, 3:3 Mid, 4:3 Fwd)
  
  // Group players by their Y-grid (Row)
  const rows = new Map<number, any[]>();
  team.startXI?.forEach((item: any) => {
    const p = item.player;
    if (p.grid) {
      const parts = p.grid.split(":");
      const row = parseInt(parts[0], 10);
      if (!rows.has(row)) rows.set(row, []);
      rows.get(row)!.push(p);
    }
  });

  // Sort rows: Row 1 is bottom (GK). For Away team, maybe reverse it visually? The prompt just says map grid.
  const sortedRows = Array.from(rows.keys()).sort((a, b) => a - b);
  if (!isHome) {
     sortedRows.reverse();
  }

  return (
    <div className="flex-1 border-2 border-ink dark:border-paper p-3 bg-paper dark:bg-paper-dark">
      <h5 className="font-display text-xs border-b border-ink/20 pb-1.5 mb-2 flex flex-col md:flex-row md:items-center justify-between gap-1">
        <span className="flex items-center gap-2">
          {team.team.logo && <img src={team.team.logo} alt="" className="w-5 h-5 object-contain" />}
          <span className="font-bold uppercase">{team.team.name}</span>
        </span>
        <span className="font-mono text-[9px] uppercase font-bold text-ink/50 dark:text-paper/50">
          FORMASI {team.formation || "TBD"}
        </span>
      </h5>

      {/* Pitch visualization */}
      <div className="bg-[#1a472a] border-2 border-[#2c6e43] rounded-sm p-2 mb-4 min-h-[250px] relative flex flex-col justify-around">
        {/* Pitch Lines */}
        <div className="absolute inset-x-0 top-1/2 h-0 border-t-2 border-[#2c6e43]/50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-[#2c6e43]/50"></div>
        
        {sortedRows.map(rowIdx => {
          const playersInRow = rows.get(rowIdx)!;
          // Sort players by col to place them properly left to right
          playersInRow.sort((a, b) => parseInt(a.grid.split(":")[1]) - parseInt(b.grid.split(":")[1]));
          
          return (
            <div key={rowIdx} className="flex justify-around items-center z-10 my-2">
              {playersInRow.map(p => (
                <div key={p.id} className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-paper text-ink flex items-center justify-center font-mono font-bold text-[9px] border-2 border-ink shadow-sm">
                    {p.number}
                  </div>
                  <span className="text-[8px] bg-ink/80 text-paper px-1 rounded-sm uppercase max-w-[50px] truncate text-center">
                    {p.name.split(" ").pop()}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-1.5 font-sans">
        <h6 className="font-mono text-[9px] mt-2 mb-1 border-b border-ink/10 pb-1 font-bold text-ink/60">CADANGAN</h6>
        {team.substitutes?.map((item: any, idx: number) => {
          const p = item.player;
          return (
            <div key={p.id || idx} className="flex items-center justify-between text-[11px] py-1 opacity-75 hover:opacity-100 hover:bg-black/5">
              <span className="flex items-center gap-1.5">
                <span className="w-5 font-mono text-[9px] font-bold text-center bg-black/10 dark:bg-white/10 px-1">
                  {p.number}
                </span>
                <span className="font-bold uppercase tracking-tight truncate max-w-[150px]">{p.name}</span>
              </span>
              <span className="font-mono text-[9px] uppercase text-ink/50 dark:text-paper/50 font-black">
                {p.pos}
              </span>
            </div>
          );
        })}
        
        {team.coach?.name && (
           <div className="mt-3 pt-2 border-t border-ink/10 text-[10px] font-mono flex items-center justify-between">
              <span className="opacity-60 uppercase">Pelatih</span>
              <span className="font-bold uppercase">{team.coach.name}</span>
           </div>
        )}
      </div>
    </div>
  );
}
