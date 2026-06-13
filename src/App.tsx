import { useState, useEffect, useMemo } from "react";
import Navbar from "./components/Navbar";
import MatchTicket from "./components/MatchTicket";
import KlasemenTab from "./components/KlasemenTab";
import BaganBracket from "./components/BaganBracket";
import MatchDetailModal from "./components/MatchDetailModal";
import TeamList from "./components/TeamList";

import { Match, Team, Venue } from "./types";
import { TEAMS, VENUES, generateGroupMatches, generateKnockoutMatches, COUNTRY_FLAG_EMOJIS, PLACEHOLDER_NAMES } from "./data";
import { simulateLiveMatchTick } from "./utils";
import { Search, Heart, Info, AlertTriangle, Play, RefreshCw, Trophy, CheckCircle } from "lucide-react";
import { useMatches } from "./hooks/useMatches";
import { useTeams } from "./hooks/useTeams";
import { useStadiums } from "./hooks/useStadiums";
import { ensureFixtureMapping } from "./lib/fixtureMapping";

export default function App() {
  // --- CORE STATE ---
  const [teams, setTeams] = useState<Team[]>(() => {
    return TEAMS;
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem("wc26_matches");
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    // Seed new default matches (completed up to June 13 UTC, scheduled for others)
    return [...generateGroupMatches(), ...generateKnockoutMatches()];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("wc26_favorites");
    return saved ? JSON.parse(saved) : ["team-idn", "team-arg", "team-mex"]; // default favorites
  });

  const [currentTab, setTab] = useState<string>("jadwal");
  const [selectedDate, setSelectedDate] = useState<string>("2026-06-13"); // active simulation day
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>("ALL");
  const [selectedVenueFilter, setSelectedVenueFilter] = useState<string>("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL"); // ALL, LIVE, UPCOMING, FT
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("wc26_dark_mode");
    return saved === "true";
  });

  const [activeDetailMatchId, setActiveDetailMatchId] = useState<string | null>(null);
  const [selectedTeamIdForDirectory, setSelectedTeamIdForDirectory] = useState<string | null>(null);
  const [venues, setVenues] = useState<Venue[]>(VENUES);

  // --- REACT QUERY API FETCHING ---
  const { data: rawApiMatches, isLoading: isMatchesLoading, error: matchesError } = useMatches();
  const { data: rawApiTeams, isLoading: isTeamsLoading } = useTeams();
  const { data: rawApiStadiums } = useStadiums();

  useEffect(() => {
    const arr = Array.isArray(rawApiTeams) ? rawApiTeams : rawApiTeams?.teams || rawApiTeams?.data;
    if (Array.isArray(arr) && arr.length > 0) {
      setTeams(arr.map((t: any) => ({
        id: String(t.id),
        name: t.name_en || t.name || t.name_fa || "Unknown",
        flagCode: t.name_en ? t.name_en.substring(0, 2).toUpperCase() : "XX",
        flagUrl: t.flag,
        group: t.groups || t.group || "A",
        fifaRanking: t.fifa_ranking || 100,
        coach: t.coach || "-",
        status: "active",
        squad: []
      })));
    }
  }, [rawApiTeams]);

  useEffect(() => {
    const arr = Array.isArray(rawApiStadiums) ? rawApiStadiums : rawApiStadiums?.stadiums || rawApiStadiums?.data;
    if (Array.isArray(arr) && arr.length > 0) {
      setVenues(arr.map((s: any) => ({
        id: String(s.id),
        stadiumName: s.name_en || s.name || s.name_fa || "Stadium",
        city: s.city_en || s.city || "City",
        country: s.country_en || s.country || "USA",
        timezone: "UTC",
        capacity: s.capacity || "0"
      })));
    }
  }, [rawApiStadiums]);

  useEffect(() => {
    const arr = Array.isArray(rawApiMatches) ? rawApiMatches : rawApiMatches?.games || rawApiMatches?.data;
    if (Array.isArray(arr) && arr.length > 0) {
      setMatches(arr.map((g: any) => {
        const isFinished = g.finished === true || String(g.finished).toUpperCase() === "TRUE";
        let status = "scheduled";
        let minute: number | undefined;
        
        try {
          if (isFinished || g.time_elapsed === 'finished') {
            status = "ft";
          } else if (g.time_elapsed === 'ht') {
            status = "ht";
          } else if (g.time_elapsed === 'notstarted') {
            status = "scheduled";
          } else if (g.time_elapsed && g.time_elapsed !== 'notstarted') {
            status = "live";
            const parsed = parseInt(g.time_elapsed);
            if (!isNaN(parsed)) minute = parsed;
          } else {
            // Fallback if no valid time_elapsed is present
            const kickoffTime = new Date(g.local_date).getTime();
            if (Date.now() >= kickoffTime) status = "live";
          }
        } catch {
          // Ignore invalid dates
        }

        return {
          id: String(g.id),
          stage: g.type === "group" ? "group" : (g.type || "round32"),
          group: g.group || "A",
          homeTeamId: String(g.home_team_id),
          awayTeamId: String(g.away_team_id),
          homeScore: Number(g.home_score) || 0,
          awayScore: Number(g.away_score) || 0,
          status: status as any,
          minute: minute,
          kickoffUtc: g.local_date ? new Date(g.local_date).toISOString() : new Date().toISOString(),
          venueId: String(g.stadium_id),
          events: []
        };
      }));
    }
  }, [rawApiMatches]);

  // --- SAVE STATE TO STORAGE ---
  useEffect(() => {
    localStorage.setItem("wc26_matches", JSON.stringify(matches));
    if (matches.length > 0 && teams.length > 0) {
      ensureFixtureMapping(matches, teams);
    }
  }, [matches, teams]);

  useEffect(() => {
    localStorage.setItem("wc26_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("wc26_dark_mode", String(darkMode));
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.documentElement.classList.add("dark");
    } else {
      document.body.classList.remove("dark-mode");
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Removed simulator runner as we are now using the external API directly

  // Helper lists of 39 days starting 11 Jun to 19 Jul 2026
  const tournamentCalendarDays = useMemo(() => {
    const daysArr = [];
    const baseDate = new Date("2026-06-11T00:00:00Z");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const dayNames = ["MNG", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];

    for (let i = 0; i < 39; i++) {
      const dayDate = new Date(baseDate);
      dayDate.setUTCDate(baseDate.getUTCDate() + i);

      const yyyy = dayDate.getUTCFullYear();
      const mm = String(dayDate.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(dayDate.getUTCDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;

      daysArr.push({
        dateString: dateStr,
        dayNum: dayDate.getUTCDate(),
        dayShort: dayNames[dayDate.getUTCDay()],
        monthShort: monthNames[dayDate.getUTCMonth()].toUpperCase(),
      });
    }
    return daysArr;
  }, []);

  // Compute status metrics
  const liveMatches = useMemo(() => {
    return matches.filter(
      (m) => m.status === "live" || m.status === "ht" || m.status === "et" || m.status === "pen"
    );
  }, [matches]);

  const hasLiveMatches = liveMatches.length > 0;

  // Filter schedules matches list based on selections
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      // 1. Date check
      const matchDateStr = m.kickoffUtc.substring(0, 10);
      if (matchDateStr !== selectedDate) return false;

      // 2. Stage/Group check
      if (selectedGroupFilter !== "ALL") {
        if (m.stage !== "group" || m.group !== selectedGroupFilter) return false;
      }

      // 3. Venue check
      if (selectedVenueFilter !== "ALL") {
        if (m.venueId !== selectedVenueFilter) return false;
      }

      // 4. Status Check
      if (selectedStatusFilter !== "ALL") {
        if (selectedStatusFilter === "LIVE" && !["live", "ht", "et", "pen"].includes(m.status)) return false;
        if (selectedStatusFilter === "UPCOMING" && m.status !== "scheduled") return false;
        if (selectedStatusFilter === "FT" && m.status !== "ft") return false;
      }

      // 5. Search check
      if (searchQuery.trim() !== "") {
        const homeT = teams.find((t) => t.id === m.homeTeamId);
        const awayT = teams.find((t) => t.id === m.awayTeamId);
        const ven = venues.find((v) => v.id === m.venueId);

        const homeName = homeT ? homeT.name : PLACEHOLDER_NAMES[m.homeTeamId] || m.homeTeamId;
        const awayName = awayT ? awayT.name : PLACEHOLDER_NAMES[m.awayTeamId] || m.awayTeamId;

        const q = searchQuery.toLowerCase();
        const matchesQuery = 
          homeName.toLowerCase().includes(q) ||
          awayName.toLowerCase().includes(q) ||
          (ven && ven.stadiumName.toLowerCase().includes(q)) ||
          (ven && ven.city.toLowerCase().includes(q));

        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [matches, selectedDate, selectedGroupFilter, selectedVenueFilter, selectedStatusFilter, searchQuery, teams]);

  // --- ACTIONS CONTROLLERS ---
  const handleToggleFavorite = (teamId: string) => {
    setFavorites((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
    );
  };

  const handleSelectTeamFromDirectory = (teamId: string) => {
    setSelectedTeamIdForDirectory(teamId);
    setTab("tim");
    setActiveDetailMatchId(null);
  };

  const handleSimulateAllInstant = () => {
    setMatches((prev) => {
      // Simulate rapid resolved scores for group stage matches
      let updated = prev.map((m) => {
        if (m.stage === "group" && m.status !== "ft") {
          const hScore = Math.floor(Math.random() * 4);
          const aScore = Math.floor(Math.random() * 4);
          const events = [];
          if (hScore > 0) {
            events.push({
              type: "goal" as const,
              minute: Math.floor(Math.random() * 85) + 5,
              teamId: m.homeTeamId,
              playerName: "Striker Penyerang",
            });
          }
          if (aScore > 0) {
            events.push({
              type: "goal" as const,
              minute: Math.floor(Math.random() * 85) + 5,
              teamId: m.awayTeamId,
              playerName: "Penyerang Away",
            });
          }

          return {
            ...m,
            status: "ft" as const,
            homeScore: hScore,
            awayScore: aScore,
            events,
          };
        }
        return m;
      });

      // resolve bracket seeds based on computed scores
      updated = resolveKnockoutSeeds(updated);
      return updated;
    });
  };

  const handleSimulateSingleTick = (matchId: string) => {
    setMatches((prev) => {
      const updated = prev.map((m) => {
        if (m.id === matchId) {
          if (m.status === "scheduled") {
            // Kick off live game!
            return {
              ...m,
              status: "live" as const,
              minute: 1,
              homeScore: 0,
              awayScore: 0,
              events: [
                {
                  type: "substitution" as const,
                  minute: 1,
                  teamId: "",
                  playerName: "KICKOFF",
                  detail: "Pertandingan Piala Dunia 2026 dimulai!",
                },
              ],
            };
          } else {
            // Force tick minute + process random event
            return simulateLiveMatchTick(m, teams);
          }
        }
        return m;
      });
      return resolveKnockoutSeeds(updated);
    });
  };

  const handleResetTournament = () => {
    if (confirm("Reset ulang data skor turnamen kembali ke awal?")) {
      setMatches([...generateGroupMatches(), ...generateKnockoutMatches()]);
    }
  };

  // Maps group standings winner names directly to phase 2 placeholders
  const resolveKnockoutSeeds = (matchList: Match[]): Match[] => {
    // To make this prototype look extremely polished, if group matches are completed,
    // we take top 1 & 2 of groups A to L and resolve seeds!
    const standingsByGroup: Record<string, string[]> = {};
    const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

    let allCompleted = true;
    groups.forEach((groupChar) => {
      // Find matches in this group
      const gMatches = matchList.filter((m) => m.stage === "group" && m.group === groupChar);
      const isCompleted = gMatches.every((m) => m.status === "ft");
      if (!isCompleted) allCompleted = false;

      // calculate standing maps
      // Simple custom calculation on the fly
      const rows = calculateMockGroupWinners(groupChar, matchList);
      standingsByGroup[groupChar] = rows; // list of teamIds ordered by rank
    });

    // Match placeholders mappings: Winner Group A = standingsByGroup["A"][0], Runner Group B = standingsByGroup["B"][1]
    const updated = matchList.map((m) => {
      if (m.stage === "round32") {
        // e.g. placeholder-32-h-1 matches Winner Group A [i=1]
        // Let's resolve mapped seed pairings dynamically
        const seedPairing = findStandingSeed(m.id, standingsByGroup);
        if (seedPairing) {
          return {
            ...m,
            homeTeamId: seedPairing.home || m.homeTeamId,
            awayTeamId: seedPairing.away || m.awayTeamId,
          };
        }
      }
      // For SF / Final stages, let we can mock-advance the winner of the antecedent node if completed!
      if (m.stage === "round16") {
        const parentLeft = resolveParentMatchWinner("round32", getRound32IdForR16(m.id, true), matchList);
        const parentRight = resolveParentMatchWinner("round32", getRound32IdForR16(m.id, false), matchList);
        return {
          ...m,
          homeTeamId: parentLeft || m.homeTeamId,
          awayTeamId: parentRight || m.awayTeamId,
        };
      }
      if (m.stage === "qf") {
        const parentLeft = resolveParentMatchWinner("round16", getR16IdForQF(m.id, true), matchList);
        const parentRight = resolveParentMatchWinner("round16", getR16IdForQF(m.id, false), matchList);
        return {
          ...m,
          homeTeamId: parentLeft || m.homeTeamId,
          awayTeamId: parentRight || m.awayTeamId,
        };
      }
      if (m.stage === "sf") {
        const parentLeft = resolveParentMatchWinner("qf", getQFIdForSF(m.id, true), matchList);
        const parentRight = resolveParentMatchWinner("qf", getQFIdForSF(m.id, false), matchList);
        return {
          ...m,
          homeTeamId: parentLeft || m.homeTeamId,
          awayTeamId: parentRight || m.awayTeamId,
        };
      }
      if (m.stage === "3rd") {
        const loserLeft = resolveParentMatchLoser("sf", "ko-sf-1", matchList);
        const loserRight = resolveParentMatchLoser("sf", "ko-sf-2", matchList);
        return {
          ...m,
          homeTeamId: loserLeft || m.homeTeamId,
          awayTeamId: loserRight || m.awayTeamId,
        };
      }
      if (m.stage === "final") {
        const parentLeft = resolveParentMatchWinner("sf", "ko-sf-1", matchList);
        const parentRight = resolveParentMatchWinner("sf", "ko-sf-2", matchList);
        return {
          ...m,
          homeTeamId: parentLeft || m.homeTeamId,
          awayTeamId: parentRight || m.awayTeamId,
        };
      }
      return m;
    });

    return updated;
  };

  // Decoy quick standings generator for seed mapping
  function calculateMockGroupWinners(groupChar: string, list: Match[]): string[] {
    const groupTeams = TEAMS.filter((t) => t.group === groupChar).map((t) => t.id);
    const scores: Record<string, number> = {};
    groupTeams.forEach((tid) => { scores[tid] = 0; });

    list.filter((m) => m.stage === "group" && m.group === groupChar && m.status === "ft").forEach((m) => {
      if (m.homeScore > m.awayScore) scores[m.homeTeamId] += 3;
      else if (m.homeScore < m.awayScore) scores[m.awayTeamId] += 3;
      else {
        scores[m.homeTeamId] += 1;
        scores[m.awayTeamId] += 1;
      }
    });

    return Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
  }

  function findStandingSeed(matchId: string, mapping: Record<string, string[]>): { home: string; away: string } | null {
    // maps simple hardcoded indices for showcase R32
    const num = parseInt(matchId.replace("ko-32-", ""));
    if (isNaN(num)) return null;

    // match groupings seeds pairings
    const gLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
    const homeGr = gLetters[(num - 1) % 12];
    const awayGr = gLetters[(num) % 12];

    const hTeams = mapping[homeGr] || [];
    const aTeams = mapping[awayGr] || [];

    return {
      home: hTeams[0] || `placeholder-32-h-${num}`,
      away: aTeams[1] || `placeholder-32-a-${num}`,
    };
  }

  function resolveParentMatchWinner(stage: Match["stage"], parentId: string, list: Match[]): string | null {
    const parent = list.find((m) => m.id === parentId);
    if (!parent || parent.status !== "ft") return null;

    if (parent.homeScore > parent.awayScore) {
      return parent.homeTeamId.startsWith("placeholder") ? null : parent.homeTeamId;
    } else if (parent.awayScore > parent.homeScore) {
      return parent.awayTeamId.startsWith("placeholder") ? null : parent.awayTeamId;
    } else if (parent.penaltyHomeScore !== undefined && parent.penaltyAwayScore !== undefined) {
      return parent.penaltyHomeScore > parent.penaltyAwayScore ? parent.homeTeamId : parent.awayTeamId;
    }
    return null;
  }

  function resolveParentMatchLoser(stage: Match["stage"], parentId: string, list: Match[]): string | null {
    const parent = list.find((m) => m.id === parentId);
    if (!parent || parent.status !== "ft") return null;

    if (parent.homeScore < parent.awayScore) {
      return parent.homeTeamId.startsWith("placeholder") ? null : parent.homeTeamId;
    } else if (parent.awayScore < parent.homeScore) {
      return parent.awayTeamId.startsWith("placeholder") ? null : parent.awayTeamId;
    } else if (parent.penaltyHomeScore !== undefined && parent.penaltyAwayScore !== undefined) {
      return parent.penaltyHomeScore < parent.penaltyAwayScore ? parent.homeTeamId : parent.awayTeamId;
    }
    return null;
  }

  // Bracket mappings structures
  function getRound32IdForR16(r16id: string, left: boolean): string {
    const idx = parseInt(r16id.replace("ko-16-", ""));
    const factor = left ? (idx * 2 - 1) : (idx * 2);
    return `ko-32-${factor}`;
  }
  function getR16IdForQF(qfid: string, left: boolean): string {
    const idx = parseInt(qfid.replace("ko-qf-", ""));
    const factor = left ? (idx * 2 - 1) : (idx * 2);
    return `ko-16-${factor}`;
  }
  function getQFIdForSF(sfid: string, left: boolean): string {
    const idx = parseInt(sfid.replace("ko-sf-", ""));
    const factor = left ? (idx * 2 - 1) : (idx * 2);
    return `ko-qf-${factor}`;
  }

  // --- FAVORITES MATCHES EXTRACTOR ---
  const favoriteMatchedGames = useMemo(() => {
    return matches.filter(
      (m) => favorites.includes(m.homeTeamId) || favorites.includes(m.awayTeamId)
    );
  }, [matches, favorites]);

  return (
    <div className={`min-h-screen font-sans pb-24 md:pb-8 transition-colors duration-200 bg-paper dark:bg-asphalt text-ink dark:text-paper selection:bg-signal-yellow selection:text-ink`}>
      
      {/* NAVBAR */}
      <Navbar
        currentTab={currentTab}
        setTab={setTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onSimulateAll={handleSimulateAllInstant}
        onResetAll={handleResetTournament}
        hasLiveMatches={hasLiveMatches}
      />

      {/* API STATUS BANNER */}
      <div className={`px-4 py-2 text-[11px] font-mono border-b-2 border-ink flex items-center gap-2 ${
        isMatchesLoading ? "bg-ink text-signal-yellow" : matchesError ? "bg-stadium-red text-paper" : "bg-azteca-green text-paper"
      }`}>
        {isMatchesLoading ? <RefreshCw size={14} className="animate-spin" /> : matchesError ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
        <span className="font-semibold tracking-wide uppercase">
          {isMatchesLoading ? "Sinkronisasi Live API WorldCup26..." : matchesError ? "Gagal terhubung API (Cek Token/URL)" : `LIVE API TERKONEKSI (${matches.length} LAGA, ${teams.length} TIM)`}
        </span>
      </div>

      {/* VIEWPORT AREA CONTENT wrapper */}
      <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">
        
        {/* TAB 1: SCHEDULES AND LIVE GAMES */}
        {currentTab === "jadwal" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            
            {/* Header info bar */}
            <div className="border-4 border-ink dark:border-paper bg-electric-blue text-paper p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[4px_4px_0_var(--color-ink)] rounded-none">
              <div>
                <h2 className="font-display text-xl md:text-2xl uppercase tracking-tight leading-none">
                  SADURAN SKOR LIVE & JADWAL KATALOG
                </h2>
                <p className="font-mono text-xs text-paper/85 mt-1.5 uppercase font-semibold">
                  Cawangan Waktu Indonesia Barat (WIB) • Tap tanggal untuk navigasi
                </p>
              </div>

              {/* Simulation Quick Launcher banner */}
              {!hasLiveMatches && (
                <button
                  onClick={() => {
                    // Set matches on this selected date to "live" state
                    setMatches((prev) =>
                      prev.map((m) => {
                        const mDate = m.kickoffUtc.substring(0, 10);
                        if (mDate === selectedDate && m.status === "scheduled") {
                          return {
                            ...m,
                            status: "live" as const,
                            minute: 10,
                            homeScore: Math.floor(Math.random() * 2),
                            awayScore: Math.floor(Math.random() * 2),
                          };
                        }
                        return m;
                      })
                    );
                  }}
                  className="cursor-pointer bg-signal-yellow hover:bg-yellow-400 text-ink font-display text-xs font-black px-4 py-2 border-2 border-ink shadow-[2px_2px_0_#111] active:translate-y-0.5 transition-all w-full md:w-auto"
                >
                  🔴 KICKOFF LAGA HARI INI
                </button>
              )}
            </div>

            {/* DATE STRIP SELECTOR (11 Jun - 19 Jul) */}
            <div className="w-full bg-paper dark:bg-paper-dark border-4 border-ink p-3 shadow-[4px_4px_0_var(--color-ink)] select-none">
              <span className="block font-sans text-xs font-black uppercase tracking-wide text-ink/65 dark:text-paper/65 mb-2.5">
                📅 KALENDER TURNAMEN PIALA DUNIA 2026:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x h-[78px]">
                {tournamentCalendarDays.map((calDay) => {
                  const isDayActive = selectedDate === calDay.dateString;
                  
                  // Check if any match is live on this day
                  const isAnyLiveOnDay = matches.some((m) => {
                    const matchDateStr = m.kickoffUtc.substring(0, 10);
                    const isStatusLive = ["live", "ht", "et", "pen"].includes(m.status);
                    return matchDateStr === calDay.dateString && isStatusLive;
                  });

                  return (
                    <button
                      key={calDay.dateString}
                      onClick={() => setSelectedDate(calDay.dateString)}
                      className={`cursor-pointer w-14 h-14 border-2 border-ink flex flex-col items-center justify-center transition-all snap-start flex-shrink-0 relative ${
                        isDayActive
                          ? "bg-electric-blue text-paper shadow-[3px_3px_0_#111] translate-y-[-2px] font-bold"
                          : "bg-paper dark:bg-paper-dark dark:text-paper hover:bg-signal-yellow hover:text-ink text-ink shadow-[1px_1px_0_#111]"
                      }`}
                    >
                      {/* Blinking live indicator on card calendar */}
                      {isAnyLiveOnDay && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-stadium-red animate-pulse-dot"></span>
                      )}
                      <span className="text-[10px] font-mono leading-none tracking-tight font-bold">{calDay.dayShort}</span>
                      <span className="text-base font-display tracking-tighter mt-1 leading-none">{calDay.dayNum}</span>
                      <span className="text-[8px] font-mono leading-none tracking-wide text-ink/50 dark:text-paper/40 font-semibold">{calDay.monthShort}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DIRECTORY FILTERS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-paper dark:bg-paper-dark border-4 border-ink p-4 shadow-[4px_4px_0_var(--color-ink)] select-none">
              {/* Filter Group */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-ink/70 dark:text-paper/70 mb-1">
                  Filter Grup Stage
                </label>
                <select
                  value={selectedGroupFilter}
                  onChange={(e) => setSelectedGroupFilter(e.target.value)}
                  className="w-full bg-paper dark:bg-paper-dark dark:text-paper hover:bg-signal-yellow/10 border-2 border-ink px-2.5 py-1.5 font-mono text-xs font-bold focus:outline-none"
                >
                  <option value="ALL">SEMUA GRUP (A - L)</option>
                  {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].map((g) => (
                    <option key={g} value={g}>GRUP {g}</option>
                  ))}
                </select>
              </div>

              {/* Filter Stadium */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-ink/70 dark:text-paper/70 mb-1">
                  Filter Kota / Venue
                </label>
                <select
                  value={selectedVenueFilter}
                  onChange={(e) => setSelectedVenueFilter(e.target.value)}
                  className="w-full bg-paper dark:bg-paper-dark dark:text-paper hover:bg-signal-yellow/10 border-2 border-ink px-2.5 py-1.5 font-mono text-xs font-bold focus:outline-none"
                >
                  <option value="ALL">SEMUA VENUE</option>
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>🚨 {v.city.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-ink/70 dark:text-paper/70 mb-1">
                  Status Laga
                </label>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="w-full bg-paper dark:bg-paper-dark dark:text-paper hover:bg-signal-yellow/10 border-2 border-ink px-2.5 py-1.5 font-mono text-xs font-bold focus:outline-none"
                >
                  <option value="ALL">SEMUA STATUS</option>
                  <option value="LIVE">SEDANG LIVE NOW</option>
                  <option value="UPCOMING">BELUM BERMAIN</option>
                  <option value="FT">SUDAH FULL TIME</option>
                </select>
              </div>

              {/* Search text query */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-ink/70 dark:text-paper/70 mb-1">
                  Cari Negara / Kota
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="mis: Indonesia, Mexico..."
                    className="w-full bg-paper dark:bg-paper-dark dark:text-paper border-2 border-ink px-2.5 py-1.5 pl-8 font-mono text-xs focus:outline-none"
                  />
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 opacity-60 text-ink dark:text-paper pointer-events-none" />
                </div>
              </div>
            </div>

            {/* CORE MATCHES FEED LIST */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b-2 border-ink pb-2">
                <span className="font-display text-sm tracking-wide uppercase text-ink dark:text-paper">
                  HASIL & JADWAL ({filteredMatches.length} PERTANDINGAN COCOK)
                </span>
                <span className="font-mono text-xs font-bold">
                  {selectedDate === "2026-06-13" && "🔴 HARI SIMULASI AKTIF"}
                </span>
              </div>

              {filteredMatches.length === 0 ? (
                <div className="border-4 border-dashed border-ink/30 dark:border-paper/30 p-12 text-center text-ink/65 dark:text-paper/65">
                  <AlertTriangle className="mx-auto h-12 w-12 text-stadium-red mb-4" />
                  <p className="font-display text-base font-black uppercase tracking-tight">Tidak ada laga ditemukan</p>
                  <p className="font-mono text-xs mt-2 text-ink/50 dark:text-paper/50">
                    Coba sesuaikan filter pencarian, grup, kota atau tanggal lain dalam kalender turnamen.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                  {filteredMatches.map((match) => (
                    <MatchTicket
                      key={match.id}
                      match={match}
                      teams={teams}
                      venues={venues}
                      isFavoriteHome={favorites.includes(match.homeTeamId)}
                      isFavoriteAway={favorites.includes(match.awayTeamId)}
                      onToggleFavorite={handleToggleFavorite}
                      onClickDetails={(id) => setActiveDetailMatchId(id)}
                      onSimulateSingle={handleSimulateSingleTick}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: GROUP STANDINGS */}
        {currentTab === "klasemen" && (
          <div className="animate-fade-in">
            <KlasemenTab
              teams={teams}
              matches={matches}
              onSelectTeam={handleSelectTeamFromDirectory}
            />
          </div>
        )}

        {/* TAB 3: KO TREE BRACKET */}
        {currentTab === "bagan" && (
          <div className="animate-fade-in">
            <BaganBracket
              matches={matches}
              teams={teams}
              onClickMatch={(id) => setActiveDetailMatchId(id)}
            />
          </div>
        )}

        {/* TAB 4: SQUAD DIRECTORY */}
        {currentTab === "tim" && (
          <div className="animate-fade-in">
            <TeamList
              teams={teams}
              matches={matches}
              venues={venues}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              selectedTeamIdInit={selectedTeamIdForDirectory}
              onClearSelectedTeam={() => setSelectedTeamIdForDirectory(null)}
            />
          </div>
        )}

        {/* TAB 5: SAVED FAVORITES FEED */}
        {currentTab === "favorit" && (
          <div className="flex flex-col gap-6 animate-fade-in uppercase">
            <div className="w-full bg-paper dark:bg-paper-dark border-4 border-ink p-4 shadow-[6px_6px_0_var(--color-ink)]">
              <h3 className="font-display text-xl uppercase tracking-tighter mb-2 text-ink dark:text-paper flex items-center gap-2">
                <Heart className="h-5 w-5 fill-stadium-red stroke-none" />
                DASHBOARD TIM FAVORIT SAYA
              </h3>
              <p className="font-mono text-xs text-ink/60 dark:text-paper/60 uppercase border-b-2 border-ink pb-2 mb-4">
                Memantau khusus pertandingan, grup, dan andalan secara ringkas
              </p>

              {/* Favorites teams listing badges */}
              <div className="flex flex-wrap gap-2.5 mb-6">
                {favorites.length === 0 ? (
                  <span className="text-xs font-mono font-extrabold text-stadium-red">
                    BELUM ADA TIM FAVORIT YANG DITAMBAHKAN. KUNJUNGI TAB "TIM 48" ATAU "KLASEMEN" UNTUK MENAMBAH ❤️
                  </span>
                ) : (
                  favorites.map((favId) => {
                    const favTeam = teams.find((t) => t.id === favId);
                    if (!favTeam) return null;
                    return (
                      <div
                        key={favId}
                        onClick={() => handleSelectTeamFromDirectory(favId)}
                        className="cursor-pointer border-2 border-ink bg-paper dark:bg-paper-dark px-3 py-1.5 flex items-center gap-2 font-display text-xs font-black hover:bg-signal-yellow hover:text-ink shadow-[2px_2px_0_#111] transition-all"
                      >
                        <span className="text-lg filter select-none">
                          {COUNTRY_FLAG_EMOJIS[favTeam.flagCode]}
                        </span>
                        <span>{favTeam.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(favId);
                          }}
                          className="hover:scale-125 transition-all outline-none"
                          title="Hapus"
                        >
                          ❌
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Filtered fixtures feed based on chosen Favorites */}
              <h4 className="font-display text-sm tracking-tight border-b-2 border-ink pb-2 mb-4">
                📅 PERTANDINGAN TIM ANDALAN ({favoriteMatchedGames.length} LAGA)
              </h4>

              {favoriteMatchedGames.length === 0 ? (
                <p className="text-center py-12 font-mono text-xs text-ink/50">
                  Tidak ada laga andalan terjadwal. Sukai salah satu negara untuk terdaftar di sini!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {favoriteMatchedGames.map((m) => (
                    <MatchTicket
                      key={m.id}
                      match={m}
                      teams={teams}
                      venues={venues}
                      isFavoriteHome={favorites.includes(m.homeTeamId)}
                      isFavoriteAway={favorites.includes(m.awayTeamId)}
                      onToggleFavorite={handleToggleFavorite}
                      onClickDetails={(id) => setActiveDetailMatchId(id)}
                      onSimulateSingle={handleSimulateSingleTick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: ABOUT PAGES INFO */}
        {currentTab === "tentang" && (
          <div className="w-full bg-paper dark:bg-paper-dark border-4 border-ink p-4 md:p-6 shadow-[6px_6px_0_var(--color-ink)] flex flex-col gap-6 animate-fade-in uppercase">
            <div>
              <h3 className="font-display text-xl uppercase tracking-tight mb-2 text-ink dark:text-paper flex items-center gap-2">
                <Info className="h-5 w-5" />
                TENTANG LIVESCORE WC26
              </h3>
              <p className="font-mono text-xs text-ink/65 dark:text-paper/65 border-b border-ink/15 pb-2 mb-4">
                Sistem Informasi & Prototip Skor Live Piala Dunia 2026 Indonesia
              </p>
            </div>

            <div className="font-sans text-sm font-medium flex flex-col gap-4 text-ink/80 dark:text-paper/95">
              <p>
                <strong>LiveScore WC26</strong> adalah website dedikasi buatan fans sepak bola Indonesia untuk memantau jalannya turnamen terbesar sepanjang sejarah: <strong>Piala Dunia FIFA 2026</strong> yang berlayar di tiga benua tuan rumah: Amerika Serikat, Kanada dan Meksiko.
              </p>
              <p>
                Dengan format turnamen baru berpencaran 48 Negara, 104 Laga, dan penambahan Babak baru "Cawangan 32 Besar". LiveScore WC26 mengimplementasikan identitas visual <strong>Neo-Brutalism</strong> yang terinspirasi dari vernacular fisik gelang penonton, gelang pers, perforasi sobekan tiket pertandingan stadion, dan stempel stensil.
              </p>

              <div className="border-4 border-ink/60 bg-paper-dark dark:bg-paper p-4 text-paper dark:text-ink font-mono text-xs my-4 rounded-none shadow-[4px_4px_0_var(--color-ink)]">
                <span className="font-display text-xs block text-signal-yellow dark:text-electric-blue mb-1.5 uppercase font-bold">
                  ⚠️ PEMBERITAHUAN HUKUM / LEGAL DISCLAIMER:
                </span>
                Platform website LiveScore WC26 ini adalah media fans independen yang bertujuan informasional dan hiburan. Website ini tidak memiliki relasi resmi, berafiliasi, disponsori, atau memegang lisensi dari FIFA, Adidas, atau badan olahraga federasi manapun. Kami secara sadar menghindari reproduksi hak cipta intelektual (logo resmi, maskot turnamen, visual bola komersial) dan membangun rasa khas Piala Dunia 2026 murni lewat perpaduan data fungsional, dan palet warna orisinal tiga tuan rumah.
              </div>

              <h4 className="font-display text-sm tracking-tight border-b border-ink/20 pb-2 mt-4 text-ink dark:text-paper">
                🏟️ DAFTAR 16 KOTA & STADION HOST PIALA DUNIA 2026
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs font-semibold">
                {venues.map((v) => (
                  <div key={v.id} className="border-2 border-ink dark:border-paper p-2.5 bg-paper dark:bg-paper-dark">
                    <span className="text-[10px] block font-black text-electric-blue dark:text-signal-yellow uppercase">
                      🚨 {v.country.toUpperCase()} • KOTA {v.city.toUpperCase()}
                    </span>
                    <strong className="block text-sm font-display text-ink dark:text-paper uppercase mt-1">
                      {v.stadiumName}
                    </strong>
                    <span className="block text-[10px] text-ink/50 dark:text-paper/40 mt-1">
                      Kapasitas: {v.capacity || "N/A"} • Waktu lokal: {v.timezone}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MATCH DETAIL DIALOG POPUP */}
      {activeDetailMatchId && (
        <MatchDetailModal
          matchId={activeDetailMatchId}
          matches={matches}
          teams={teams}
          venues={venues}
          onClose={() => setActiveDetailMatchId(null)}
          onSimulateSingle={handleSimulateSingleTick}
        />
      )}

    </div>
  );
}
