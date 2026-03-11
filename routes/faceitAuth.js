const router = require("express").Router();
const axios = require("axios");
const User = require("../models/User");

// Регистрация / логин через Faceit
router.get("/:nickname", async (req, res) => {
  try {
    const { nickname } = req.params;
    const game = "cs2"; // CS2

    // Получаем данные игрока с Faceit
    const response = await axios.get(`https://open.faceit.com/data/v4/players`, {
      headers: { Authorization: `Bearer ${process.env.FACEIT_KEY}` },
      params: { nickname, game }
    });

    const data = response.data;

    // Проверяем, есть ли игрок в базе
    let user = await User.findOne({ faceitId: data.player_id });

    if (!user) {
      // Если нет — создаём нового
      user = new User({
        nickname: data.nickname,
        faceitId: data.player_id,
        elo: data.games[game]?.faceit_elo || 0,
        level: data.games[game]?.skill_level || 0,
        country: data.country?.toLowerCase() || "unknown"
      });
      await user.save();
    } else {
      // Обновляем данные, если уже есть
      user.elo = data.games[game]?.faceit_elo || 0;
      user.level = data.games[game]?.skill_level || 0;
      user.country = data.country?.toLowerCase() || user.country;
      await user.save();
    }

    res.json({ message: "Logged in via Faceit", user });
  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

module.exports = router;