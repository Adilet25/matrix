const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require("../models/User");

// Получение данных Faceit
router.get("/:nickname", async (req, res) => {
  try {
    const { nickname } = req.params;
    let game = "cs2";
    let response;

    try {
      response = await axios.get("https://open.faceit.com/data/v4/players", {
        headers: { Authorization: `Bearer ${process.env.FACEIT_KEY}` },
        params: { nickname, game }
      });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        game = "csgo";
        response = await axios.get("https://open.faceit.com/data/v4/players", {
          headers: { Authorization: `Bearer ${process.env.FACEIT_KEY}` },
          params: { nickname, game }
        });
      } else throw err;
    }

    const data = response.data;
    let user = await User.findOne({ faceitId: data.player_id });

    if (!user) {
      user = new User({
        nickname: data.nickname,
        faceitId: data.player_id,
        elo: data.games[game]?.faceit_elo || 0,
        level: data.games[game]?.skill_level || 0,
        country: data.country?.toLowerCase() || "unknown"
      });
    } else {
      user.elo = data.games[game]?.faceit_elo || 0;
      user.level = data.games[game]?.skill_level || 0;
      user.country = data.country?.toLowerCase() || user.country;
    }

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

module.exports = router;