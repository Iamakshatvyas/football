import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

function statusMap(status) {
  switch (status) {
    case "SCHEDULED":
    case "TIMED":
      return "NS";

    case "LIVE":
      return "LIVE";

    case "IN_PLAY":
      return "1H";

    case "PAUSED":
      return "HT";

    case "FINISHED":
      return "FT";

    default:
      return status;
  }
}

function normalize(match) {
  return {
    fixture: {
      id: match.id,
      date: match.utcDate,
      status: {
        short: statusMap(match.status),
        long: match.status,
      },
    },

    league: {
      id: match.competition?.id,
      name: match.competition?.name,
      logo: match.competition?.emblem,
    },

    teams: {
      home: {
        id: match.homeTeam?.id,
        name: match.homeTeam?.name,
        logo: match.homeTeam?.crest,
      },

      away: {
        id: match.awayTeam?.id,
        name: match.awayTeam?.name,
        logo: match.awayTeam?.crest,
      },
    },

    goals: {
      home: match.score?.fullTime?.home,
      away: match.score?.fullTime?.away,
    },

    score: match.score,

    raw: match,
  };
}

async function fetchMatches() {
  try {
    const res = await api.get("/getFixtures");

    return (res.data.matches || []).map(normalize);
  } catch (err) {
    console.error("MatchService:", err);
    return [];
  }
}

/* ---------------- Upcoming Fixtures ---------------- */

export const getFixtures = async () => {
  const fixtures = await fetchMatches();

  const now = new Date();
  const next34Hours = new Date(now.getTime() + 34 * 60 * 60 * 1000);

  return fixtures
    .filter((fixture) => {
      const kickoff = new Date(fixture.fixture.date);

      return (
        kickoff >= now &&
        kickoff <= next34Hours &&
        fixture.fixture.status.short === "NS"
      );
    })
    .sort(
      (a, b) =>
        new Date(a.fixture.date) - new Date(b.fixture.date)
    );
};

/* ---------------- Results ---------------- */

export const getRecentResults = async () => {
  const fixtures = await fetchMatches();

  return fixtures
    .filter(
      (fixture) =>
        fixture.fixture.status.short === "FT"
    )
    .sort(
      (a, b) =>
        new Date(b.fixture.date) - new Date(a.fixture.date)
    );
};

/* ---------------- Live Matches ---------------- */

export const getLiveFixtures = async () => {
  const fixtures = await fetchMatches();

  return fixtures.filter((fixture) =>
    ["LIVE", "1H", "HT"].includes(
      fixture.fixture.status.short
    )
  );
};