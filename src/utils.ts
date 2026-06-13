import { Match, StandingRow, Team } from "./types";

export function calculateStandings(groupId: string, teams: Team[], matches: Match[]): StandingRow[] {
  const groupTeams = teams.filter((t) => t.group === groupId);
  const rows: Record<string, StandingRow> = {};

  // Initialize
  groupTeams.forEach((t) => {
    rows[t.id] = {
      teamId: t.id,
      played: 0,
      win: 0,
      draw: 0,
      loss: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
      zone: "out",
    };
  });

  // Filter matches for this group & calculate
  const groupMatches = matches.filter(
    (m) => m.stage === "group" && m.group === groupId && m.status !== "scheduled" && m.status !== "postponed"
  );

  groupMatches.forEach((m) => {
    const homeSrc = rows[m.homeTeamId];
    const awaySrc = rows[m.awayTeamId];

    if (!homeSrc || !awaySrc) return;

    homeSrc.played += 1;
    awaySrc.played += 1;

    homeSrc.goalsFor += m.homeScore;
    homeSrc.goalsAgainst += m.awayScore;
    awaySrc.goalsFor += m.awayScore;
    awaySrc.goalsAgainst += m.homeScore;

    if (m.homeScore > m.awayScore) {
      homeSrc.win += 1;
      homeSrc.points += 3;
      awaySrc.loss += 1;
    } else if (m.homeScore < m.awayScore) {
      awaySrc.win += 1;
      awaySrc.points += 3;
      homeSrc.loss += 1;
    } else {
      homeSrc.draw += 1;
      homeSrc.points += 1;
      awaySrc.draw += 1;
      awaySrc.points += 1;
    }
  });

  // Convert to array and calculate diffs
  const result = Object.values(rows).map((r) => {
    r.goalDiff = r.goalsFor - r.goalsAgainst;
    return r;
  });

  // Sort based on FIFA rules
  result.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;

    // FIFA ranking fallback
    const teamA = teams.find((t) => t.id === a.teamId);
    const teamB = teams.find((t) => t.id === b.teamId);
    return (teamA?.fifaRanking || 100) - (teamB?.fifaRanking || 100);
  });

  // Assign Zones based on position
  return result.map((row, index) => {
    let zone: StandingRow["zone"] = "out";
    if (index === 0 || index === 1) zone = "auto";
    else if (index === 2) zone = "best_third";
    return { ...row, zone };
  });
}

// Generate realistic match simulation updates
// Ticks live games, increments minute, randomly adds goals, yellow cards, etc.
export function simulateLiveMatchTick(match: Match, teams: Team[]): Match {
  if (match.status !== "live" && match.status !== "ht" && match.status !== "et" && match.status !== "pen") {
    return match;
  }

  const updated = { ...match, events: [...match.events] };
  let currentMin = updated.minute || 0;

  // If half time, wait/tick or progress to babak 2
  if (updated.status === "ht") {
    // 10% chance to progress to second half
    if (Math.random() < 0.25) {
      updated.status = "live";
      updated.minute = 46;
      updated.events.push({
        type: "substitution", // Or visual marker
        minute: 46,
        teamId: "",
        playerName: "Babak Kedua Dinilai Mulai",
        detail: "Permainan kembali berlangsung",
      });
    }
    return updated;
  }

  currentMin += 1;
  updated.minute = currentMin;

  // Check if half time reached
  if (currentMin === 45 && updated.status === "live") {
    updated.status = "ht";
    updated.events.push({
      type: "ht",
      minute: 45,
      teamId: "",
      playerName: "HALF TIME",
      detail: "Jeda Istirahat Babak Pertama Selesai",
    });
    return updated;
  }

  // Check if normal full time reached
  if (currentMin === 90) {
    if (match.stage === "group") {
      updated.status = "ft";
      updated.events.push({
        type: "ft",
        minute: 90,
        teamId: "",
        playerName: "FULL TIME",
        detail: "Peluit akhir dibunyikan!",
      });
    } else {
      // Knockout stages go into Extra Time if draw
      if (updated.homeScore === updated.awayScore) {
        updated.status = "et";
        updated.minute = 91;
        updated.events.push({
          type: "substitution",
          minute: 90,
          teamId: "",
          playerName: "EXTRA TIME",
          detail: "Pertandingan dilanjutkan ke Babak Tambahan 2x15 Menit!",
        });
      } else {
        updated.status = "ft";
        updated.events.push({
          type: "ft",
          minute: 90,
          teamId: "",
          playerName: "FULL TIME",
          detail: "Laga babak gugur selesai!",
        });
      }
    }
    return updated;
  }

  // Handle Extra Time Ticking
  if (updated.status === "et") {
    if (currentMin >= 120) {
      if (updated.homeScore === updated.awayScore) {
        updated.status = "pen";
        updated.events.push({
          type: "substitution",
          minute: 120,
          teamId: "",
          playerName: "PENALTY SHOOTOUT",
          detail: "Pemenang ditentukan melalui Adu Penalti!",
        });
      } else {
        updated.status = "ft";
        updated.events.push({
          type: "ft",
          minute: 120,
          teamId: "",
          playerName: "FULL TIME (AET)",
          detail: "Selesai Babak Perpanjangan Waktu!",
        });
      }
      return updated;
    }
  }

  // Handle Penalty Shootout simulation
  if (updated.status === "pen") {
    // fast penalty shootout simulator
    const pH = updated.penaltyHomeScore || 0;
    const pA = updated.penaltyAwayScore || 0;
    if (Math.abs(pH - pA) >= 2 && pH + pA >= 5) {
      updated.status = "ft";
      updated.events.push({
        type: "ft",
        minute: 120,
        teamId: "",
        playerName: `Adu Penalti Selesai: (${pH} - ${pA})`,
        detail: `Laga dimenangkan oleh ${pH > pA ? "Home" : "Away"}!`,
      });
    } else if (pH >= 5 && pA >= 5 && pH !== pA) {
      updated.status = "ft";
      updated.events.push({
        type: "ft",
        minute: 120,
        teamId: "",
        playerName: `Adu Penalti Selesai: (${pH} - ${pA})`,
        detail: `Kemenangan dramatis adu penalti!`,
      });
    } else {
      // simulate random scores
      if (Math.random() < 0.5) {
        updated.penaltyHomeScore = pH + (Math.random() > 0.3 ? 1 : 0);
      } else {
        updated.penaltyAwayScore = pA + (Math.random() > 0.3 ? 1 : 0);
      }
    }
    return updated;
  }

  // Standard live event chance per minute (e.g. 8% chance of exciting event)
  if (Math.random() < 0.08) {
    const isHome = Math.random() < 0.5;
    const actingTeamId = isHome ? updated.homeTeamId : updated.awayTeamId;
    const actingTeam = teams.find((t) => t.id === actingTeamId);
    
    const eventTypeRoll = Math.random();

    if (eventTypeRoll < 0.35) {
      // GOAL!
      if (isHome) updated.homeScore += 1;
      else updated.awayScore += 1;

      const shooter = actingTeam?.squad[Math.floor(Math.random() * 11)]?.name || "Player";
      updated.events.push({
        type: "goal",
        minute: currentMin,
        teamId: actingTeamId,
        playerName: shooter,
        detail: `Gol spektakuler! Tendangan keras meluncur deras ke pojok gawang.`
      });
    } else if (eventTypeRoll < 0.70) {
      // Yellow Card
      const targetedPlayer = actingTeam?.squad[Math.floor(Math.random() * 11)]?.name || "Player";
      updated.events.push({
        type: "yellow_card",
        minute: currentMin,
        teamId: actingTeamId,
        playerName: targetedPlayer,
        detail: "Pelanggaran taktikal yang menghentikan serangan balik cepat."
      });
    } else if (eventTypeRoll < 0.85) {
      // Substitution
      const outP = actingTeam?.squad[Math.floor(Math.random() * 6) + 5]?.name || "Out Player";
      const inP = actingTeam?.squad[Math.floor(Math.random() * 5)]?.name || "In Player";
      updated.events.push({
        type: "substitution",
        minute: currentMin,
        teamId: actingTeamId,
        playerName: `${inP} (In) / ${outP} (Out)`,
        detail: "Penyegaran formasi untuk menambah daya dobrak."
      });
    } else {
      // Red card!
      const targetedPlayer = actingTeam?.squad[Math.floor(Math.random() * 10) + 1]?.name || "Player";
      updated.events.push({
        type: "red_card",
        minute: currentMin,
        teamId: actingTeamId,
        playerName: targetedPlayer,
        detail: "Kartu merah langsung! Tekel berbahaya dari arah belakang."
      });
    }
  }

  return updated;
}
