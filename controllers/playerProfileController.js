const axios = require("axios");

const FACEIT_BASE_URL = "https://open.faceit.com/data/v4";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${process.env.FACEIT_KEY}`,
});

const toNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
};

const roundTo = (value, digits = 1) => {
  return Number(value.toFixed(digits));
};

const normalizeMapName = (map) => {
  if (!map) return "--";
  return String(map)
    .replace("de_", "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const buildStatsSummary = (items = []) => {
  let wins = 0;
  let losses = 0;
  let totalKills = 0;
  let totalDeaths = 0;
  let totalAssists = 0;
  let totalAdr = 0;
  let totalHeadshots = 0;

  for (const item of items) {
    const stats = item.stats || {};

    const kills = toNumber(stats.Kills);
    const deaths = toNumber(stats.Deaths);
    const assists = toNumber(stats.Assists);
    const adr = toNumber(stats.ADR);
    const headshots = toNumber(stats.Headshots);
    const result = String(stats.Result || "").trim();

    totalKills += kills;
    totalDeaths += deaths;
    totalAssists += assists;
    totalAdr += adr;
    totalHeadshots += headshots;

    if (result === "1") {
      wins += 1;
    } else {
      losses += 1;
    }
  }

  const matches = items.length;
  const winrate = matches ? roundTo((wins / matches) * 100, 1) : 0;
  const kd = totalDeaths
    ? roundTo(totalKills / totalDeaths, 2)
    : totalKills
      ? roundTo(totalKills, 2)
      : 0;
  const avgKills = matches ? roundTo(totalKills / matches, 1) : 0;
  const avgDeaths = matches ? roundTo(totalDeaths / matches, 1) : 0;
  const avgAssists = matches ? roundTo(totalAssists / matches, 1) : 0;
  const headshot = totalKills
    ? roundTo((totalHeadshots / totalKills) * 100, 1)
    : 0;
  const adr = matches ? roundTo(totalAdr / matches, 1) : 0;

  // Matrix pseudo rating
  const rating = roundTo(
    kd * 0.5 + (winrate / 100) * 0.3 + (adr / 100) * 0.2,
    2,
  );

  return {
    matches,
    wins,
    losses,
    winrate,
    kd,
    headshot,
    adr,
    avgKills,
    avgDeaths,
    avgAssists,
    rating,
  };
};

const buildRecentMatches = (items = []) => {
  return items.slice(0, 10).map((item) => {
    const stats = item.stats || {};

    return {
      matchId: stats["Match Id"] || "",
      map: normalizeMapName(stats.Map),
      result: String(stats.Result || "") === "1" ? "WIN" : "LOSS",
      score: stats.Score || "--",
      kills: toNumber(stats.Kills),
      deaths: toNumber(stats.Deaths),
      assists: toNumber(stats.Assists),
      adr: toNumber(stats.ADR),
      headshot: toNumber(stats["Headshots %"]),
      eloChange: "—",
      playedAt: stats["Created At"] || null,
    };
  });
};

const buildMapStats = (items = []) => {
  const mapStore = new Map();

  for (const item of items) {
    const stats = item.stats || {};
    const map = normalizeMapName(stats.Map);
    const result = String(stats.Result || "") === "1";

    if (!mapStore.has(map)) {
      mapStore.set(map, {
        map,
        matches: 0,
        wins: 0,
      });
    }

    const current = mapStore.get(map);
    current.matches += 1;
    if (result) current.wins += 1;
  }

  return Array.from(mapStore.values())
    .map((entry) => ({
      map: entry.map,
      matches: entry.matches,
      winrate: entry.matches
        ? roundTo((entry.wins / entry.matches) * 100, 1)
        : 0,
    }))
    .sort((a, b) => b.matches - a.matches)
    .slice(0, 6);
};

const fetchPlayerByNickname = async (nickname) => {
  const response = await axios.get(`${FACEIT_BASE_URL}/players`, {
    headers: getAuthHeaders(),
    params: { nickname },
  });

  return response.data;
};

const fetchPlayerStats = async (playerId, limit = 30, gameId = "cs2") => {
  const response = await axios.get(
    `${FACEIT_BASE_URL}/players/${playerId}/games/${gameId}/stats`,
    {
      headers: getAuthHeaders(),
      params: {
        limit,
        offset: 0,
      },
    },
  );

  return response.data.items || [];
};

const getPlayerProfile = async (req, res) => {
  try {
    const { nickname } = req.params;

    if (!nickname) {
      return res.status(400).json({ message: "Nickname is required" });
    }

    const playerData = await fetchPlayerByNickname(nickname);

    if (!playerData || !playerData.player_id) {
      return res.status(404).json({ message: "Player not found" });
    }

    const playerId = playerData.player_id;
    const cs2Data = playerData.games?.cs2 || {};

    const [items30, items60, items90] = await Promise.all([
      fetchPlayerStats(playerId, 30),
      fetchPlayerStats(playerId, 60),
      fetchPlayerStats(playerId, 90),
    ]);

    const stats30 = buildStatsSummary(items30);
    const stats60 = buildStatsSummary(items60);
    const stats90 = buildStatsSummary(items90);

    const recentMatches = buildRecentMatches(items30);
    const mapStats = buildMapStats(items90);

    return res.json({
      playerId,
      nickname: playerData.nickname || nickname,
      avatar: playerData.avatar || "",
      country: playerData.country || "--",
      elo: toNumber(cs2Data.faceit_elo),
      level: toNumber(cs2Data.skill_level),
      serverRank: null,

      // top cards can use 30-match stats by default
      kd: stats30.kd,
      winrate: stats30.winrate,
      headshot: stats30.headshot,
      adr: stats30.adr,
      matches: stats30.matches,
      avgKills: stats30.avgKills,
      avgDeaths: stats30.avgDeaths,
      avgAssists: stats30.avgAssists,
      rating: stats30.rating,

      performance: {
        30: stats30,
        60: stats60,
        90: stats90,
      },

      recentMatches,
      tournaments: [],
      mapStats,
    });
  } catch (err) {
    console.error("getPlayerProfile error:", err.response?.data || err.message);
    return res.status(500).json({
      message: "Failed to load player profile",
      error: err.response?.data || err.message,
    });
  }
};

module.exports = {
  getPlayerProfile,
};
