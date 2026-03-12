const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    const gameId = req.query.gameId || "cs2";
    const region = req.query.region || "EU";
    const country = (req.query.country || "").trim().toLowerCase();

    const params = {
      limit,
      offset,
    };

    if (country) {
      params.country = country;
    }

    const response = await axios.get(
      `https://open.faceit.com/data/v4/rankings/games/${gameId}/regions/${region}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FACEIT_KEY}`,
        },
        params,
      },
    );

    res.json(response.data.items || []);
  } catch (err) {
    console.log("FACEIT leaderboard error:", err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data || err.message,
    });
  }
});

module.exports = router;
