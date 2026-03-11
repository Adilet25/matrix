const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Топ 10 игроков из Кыргызстана
router.get("/", async (req, res) => {
  try {
    const topPlayers = await User.find({ country: "kg" }) // теперь с маленькими буквами
      .sort({ elo: -1 })
      .limit(10)
      .select("nickname elo level country");

    res.json(topPlayers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;