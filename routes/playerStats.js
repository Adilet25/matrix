const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params;
    const limit = Number(req.query.limit) || 30;
    const gameId = req.query.gameId || "cs2";

    const response = await axios.get(
      `https://open.faceit.com/data/v4/players/${playerId}/games/${gameId}/stats`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FACEIT_KEY}`,
        },
        params: {
          limit,
          offset: 0,
        },
      },
    );

    const items = response.data.items || [];

    let wins = 0;
    let losses = 0;
    let totalKills = 0;
    let totalDeaths = 0;

    for (const item of items) {
      const stats = item.stats || {};

      const kills = Number(stats.Kills || 0);
      const deaths = Number(stats.Deaths || 0);
      const result = String(stats.Result || "").trim();

      totalKills += kills;
      totalDeaths += deaths;

      if (result === "1") {
        wins += 1;
      } else {
        losses += 1;
      }
    }

    const totalMatches = items.length;
    const avgKills = totalMatches
      ? (totalKills / totalMatches).toFixed(1)
      : "0.0";
    const kd = totalDeaths
      ? (totalKills / totalDeaths).toFixed(2)
      : totalKills
        ? totalKills.toFixed(2)
        : "0.00";
    const winrate = totalMatches
      ? ((wins / totalMatches) * 100).toFixed(1)
      : "0.0";

    res.json({
      totalMatches,
      wins,
      losses,
      winrate,
      kd,
      avgKills,
    });
  } catch (err) {
    console.log(
      "FACEIT player stats error:",
      err.response?.data || err.message,
    );
    res.status(500).json({
      error: err.response?.data || err.message,
    });
  }
});

module.exports = router;
