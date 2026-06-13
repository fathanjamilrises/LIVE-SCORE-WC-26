import { useState } from "react";
import { Team, Match, StandingRow } from "../types";
import { calculateStandings } from "../utils";
import { useGroupStandings } from "../hooks/useGroupStandings";
import { COUNTRY_FLAG_EMOJIS } from "../data";

interface KlasemenTabProps {
  teams: Team[];
  matches: Match[];
  onSelectTeam: (teamId: string) => void;
}

export default function KlasemenTab({ teams, matches, onSelectTeam }: KlasemenTabProps) {
  const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  const [selectedGroup, setSelectedGroup] = useState("D"); // default to group D (contains Indonesia!)

  const { data: apiGroups } = useGroupStandings();
  
  let standings = calculateStandings(selectedGroup, teams, matches);

  // Use API standings if available
  const apiGroupsData = Array.isArray(apiGroups) ? apiGroups : apiGroups?.groups || apiGroups?.data;
  if (Array.isArray(apiGroupsData) && apiGroupsData.length > 0) {
    const apiGroup = apiGroupsData.find((g: any) => g.name === selectedGroup);
    if (apiGroup && Array.isArray(apiGroup.teams)) {
      standings = apiGroup.teams.map((t: any) => {
        return {
          teamId: String(t.team_id),
          played: Number(t.mp),
          win: Number(t.w),
          draw: Number(t.d),
          loss: Number(t.l),
          goalsFor: Number(t.gf),
          goalsAgainst: Number(t.ga),
          goalDiff: Number(t.gd),
          points: Number(t.pts),
          zone: "out" as StandingRow["zone"]
        };
      });

      // Sort
      standings.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        return 0; // Or other tiebreaker
      });

      // Re-assign zones based on sorted index
      standings = standings.map((row, index) => {
        let zone: StandingRow["zone"] = "out";
        if (index === 0 || index === 1) zone = "auto";
        else if (index === 2) zone = "best_third";
        return { ...row, zone };
      });
    }
  }

  return (
    <div className="w-full bg-paper dark:bg-paper-dark border-4 border-ink dark:border-paper p-4 shadow-[6px_6px_0_var(--color-ink)] dark:shadow-[6px_6px_0_var(--color-paper)] transition-all">
      {/* Group tab/segment Selector list */}
      <h3 className="font-display text-xl uppercase tracking-tight mb-3 text-ink dark:text-paper border-b-2 border-ink pb-2">
        KLASEMEN GRUP PIALA DUNIA 2026
      </h3>

      {/* Horizontal scrolling group selector chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-none snap-x select-none">
        {groups.map((groupChar) => (
          <button
            key={groupChar}
            onClick={() => setSelectedGroup(groupChar)}
            className={`cursor-pointer flex-shrink-0 w-11 h-11 border-2 border-ink font-display text-base font-black flex items-center justify-center transition-all snap-start ${
              selectedGroup === groupChar
                ? "bg-electric-blue text-paper shadow-[3px_3px_0_#111] translate-y-[-2px]"
                : "bg-paper dark:bg-paper-dark hover:bg-signal-yellow text-ink dark:text-paper shadow-[1px_1px_0_#111]"
            }`}
          >
            {groupChar}
          </button>
        ))}
      </div>

      {/* Standings Table container */}
      <div className="overflow-x-auto mt-4 border-2 border-ink bg-paper dark:bg-asphalt">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-ink text-paper font-mono text-xs uppercase tracking-wider select-none">
              <th className="py-2 px-3 text-center w-12 border-r border-paper/10">POS</th>
              <th className="py-2 px-3 border-r border-paper/10">TIM</th>
              <th className="py-2 px-2 text-center w-12 border-r border-paper/10">P</th>
              <th className="py-2 px-2 text-center w-10 border-r border-paper/10">W</th>
              <th className="py-2 px-2 text-center w-10 border-r border-paper/10">D</th>
              <th className="py-2 px-2 text-center w-10 border-r border-paper/10">L</th>
              <th className="py-2 px-3 text-center w-16 border-r border-paper/10">GOL</th>
              <th className="py-2 px-3 text-center w-12 border-r border-paper/10">SG</th>
              <th className="py-2 px-3 text-center w-14 font-black">PTS</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row, index) => {
              const team = teams.find((t) => t.id === row.teamId);
              if (!team) return null;

              // Left border status colors matching design.md 3.4 Spec
              let borderLeftClass = "border-l-6 border-line-gray";
              let rowBg = "hover:bg-ink/5 dark:hover:bg-paper/5";
              let opacityClass = "opacity-100";

              if (row.zone === "auto") {
                borderLeftClass = "border-l-6 border-azteca-green";
              } else if (row.zone === "best_third") {
                borderLeftClass = "border-l-6 border-signal-yellow";
              } else {
                borderLeftClass = "border-l-6 border-line-gray/40";
                opacityClass = "opacity-60";
              }

              return (
                <tr
                  key={row.teamId}
                  onClick={() => onSelectTeam(team.id)}
                  className={`border-b-2 border-ink/10 dark:border-paper/15 font-sans font-medium text-ink dark:text-paper cursor-pointer transition-colors ${rowBg} ${opacityClass} ${borderLeftClass}`}
                >
                  {/* Position */}
                  <td className="py-2.5 px-2 text-center font-mono font-bold border-r border-ink/10 dark:border-paper/10 select-none">
                    {index + 1}
                  </td>
                  
                  {/* Team detail */}
                  <td className="py-2.5 px-3 font-display text-sm md:text-base font-bold tracking-tight uppercase border-r border-ink/10 dark:border-paper/10">
                    <span className="flex items-center gap-2">
                      <span className="text-xl leading-none flex items-center justify-center min-w-[32px]">
                        {team.flagUrl ? <img src={team.flagUrl} alt="" className="h-5 w-7 object-cover border border-ink/20" /> : (COUNTRY_FLAG_EMOJIS[team.flagCode] || "🏳️")}
                      </span>
                      <span className="hover:underline">{team.name}</span>
                      {team.id === "team-idn" && (
                        <span className="ml-1 text-[9px] bg-stadium-red text-paper px-1 py-0.5 font-mono select-none">
                          KITA INDONESIA 🇮🇩
                        </span>
                      )}
                    </span>
                  </td>

                  {/* Played, Won, Drew, Lost, Goals, Goal Diff, Points */}
                  <td className="py-2.5 px-2 text-center font-mono font-bold border-r border-ink/10 dark:border-paper/10 text-xs md:text-sm">
                    {row.played}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono border-r border-ink/10 dark:border-paper/10 text-xs md:text-sm text-ink/70 dark:text-paper/70">
                    {row.win}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono border-r border-ink/10 dark:border-paper/10 text-xs md:text-sm text-ink/70 dark:text-paper/70">
                    {row.draw}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono border-r border-ink/10 dark:border-paper/10 text-xs md:text-sm text-ink/70 dark:text-paper/70">
                    {row.loss}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono border-r border-ink/10 dark:border-paper/10 text-xs md:text-sm text-ink/70 dark:text-paper/70">
                    {row.goalsFor}:{row.goalsAgainst}
                  </td>
                  <td className={`py-2.5 px-3 text-center font-mono font-bold border-r border-ink/10 dark:border-paper/10 text-xs md:text-sm ${
                    row.goalDiff > 0 ? "text-azteca-green" : row.goalDiff < 0 ? "text-stadium-red" : ""
                  }`}>
                    {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-sm md:text-base font-black bg-black/5 dark:bg-white/5">
                    {row.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Rules Footer explanation legend matching 3.4 of Spec */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono font-bold text-ink/70 dark:text-paper/70 border-t border-dashed border-ink/20 pt-3 select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-azteca-green border border-ink"></span>
          <span>Lolos langsung Babak 32 Besar (Juara & Runner-up)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-signal-yellow border border-ink"></span>
          <span>Potensi Lolos R32 (8 Peringkat 3 Terbaik dari 12 Grup)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-line-gray/50 border border-ink/30"></span>
          <span>Tersingkir</span>
        </div>
      </div>
    </div>
  );
}
