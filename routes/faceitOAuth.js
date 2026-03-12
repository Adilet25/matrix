const router = require("express").Router();
const axios = require("axios");
const crypto = require("crypto");
const User = require("../models/User");

function buildAuthorizeUrl(state) {
  const params = new URLSearchParams({
    client_id: process.env.FACEIT_CLIENT_ID,
    redirect_uri: process.env.FACEIT_REDIRECT_URI,
    response_type: "code",
    scope: "openid",
    state,
  });

  return `https://accounts.faceit.com?${params.toString()}`;
}

// Шаг 1: отправляем пользователя на Faceit login
router.get("/login", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  req.session.faceitState = state;
  res.redirect(buildAuthorizeUrl(state));
});

// Шаг 2: callback после успешного входа
router.get("/callback", async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.status(400).json({ error });
  }

  if (!code) {
    return res.status(400).json({ error: "No authorization code received" });
  }

  if (!state || state !== req.session.faceitState) {
    return res.status(400).json({ error: "Invalid state" });
  }

  try {
    const basicAuth = Buffer.from(
      `${process.env.FACEIT_CLIENT_ID}:${process.env.FACEIT_CLIENT_SECRET}`
    ).toString("base64");

    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.FACEIT_REDIRECT_URI,
    });

    // Шаг 3: меняем code на access_token
    const tokenResponse = await axios.post(
      "https://api.faceit.com/auth/v1/oauth/token",
      tokenParams.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicAuth}`,
        },
      }
    );

    const { access_token } = tokenResponse.data;

    // Шаг 4: получаем OpenID userinfo
    const userInfoResponse = await axios.get(
      "https://api.faceit.com/auth/v1/resources/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const userInfo = userInfoResponse.data;
    const faceitId = userInfo.sub;

    if (!faceitId) {
      return res.status(400).json({ error: "Faceit user id (sub) not found" });
    }

    // Шаг 5: получаем полный профиль игрока через Data API
    const playerResponse = await axios.get(
      `https://open.faceit.com/data/v4/players/${faceitId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FACEIT_KEY}`,
        },
      }
    );

    const player = playerResponse.data;
    const cs2 = player.games?.cs2 || player.games?.csgo || {};

    let user = await User.findOne({ faceitId });

    if (!user) {
      user = new User({
        faceitId,
        nickname: player.nickname || "FaceitUser",
        avatar: player.avatar || "",
        elo: cs2.faceit_elo || 0,
        level: cs2.skill_level || 0,
        country: (player.country || "unknown").toLowerCase(),
      });
    } else {
      user.nickname = player.nickname || user.nickname;
      user.avatar = player.avatar || user.avatar;
      user.elo = cs2.faceit_elo || user.elo || 0;
      user.level = cs2.skill_level || user.level || 0;
      user.country = (player.country || user.country || "unknown").toLowerCase();
    }

    await user.save();

    req.session.userId = user._id;
    delete req.session.faceitState;

    // редирект на фронт
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/success?nickname=${encodeURIComponent(user.nickname)}`
    );
  } catch (err) {
    console.log("FACEIT OAuth error:", err.response?.data || err.message);
    return res.status(500).json({
      error: err.response?.data || err.message,
    });
  }
});

// Текущий авторизованный пользователь
router.get("/me", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

module.exports = router;