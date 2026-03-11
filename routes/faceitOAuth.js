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

  return `https://api.faceit.com/oauth/authorize?${params.toString()}`;
}

router.get("/login", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  req.session.faceitState = state;
  res.redirect(buildAuthorizeUrl(state));
});

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
    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.FACEIT_CLIENT_ID,
      client_secret: process.env.FACEIT_CLIENT_SECRET,
      redirect_uri: process.env.FACEIT_REDIRECT_URI,
    });

    const tokenResponse = await axios.post(
      "https://api.faceit.com/oauth/token",
      tokenParams.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;

    const meResponse = await axios.get("https://open.faceit.com/data/v4/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = meResponse.data;
    const cs2 = data.games?.cs2 || data.games?.csgo || {};

    let user = await User.findOne({ faceitId: data.player_id });

    if (!user) {
      user = new User({
        nickname: data.nickname,
        faceitId: data.player_id,
        avatar: data.avatar || "",
        country: (data.country || "unknown").toLowerCase(),
        elo: cs2.faceit_elo || 0,
        level: cs2.skill_level || 0,
      });
    } else {
      user.nickname = data.nickname;
      user.avatar = data.avatar || user.avatar;
      user.country = (data.country || user.country || "unknown").toLowerCase();
      user.elo = cs2.faceit_elo || user.elo || 0;
      user.level = cs2.skill_level || user.level || 0;
    }

    await user.save();

    req.session.userId = user._id;
    delete req.session.faceitState;

    res.redirect(
      `${process.env.FRONTEND_URL}/auth/success?nickname=${encodeURIComponent(user.nickname)}`
    );
  } catch (err) {
    console.log("FACEIT OAuth error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

router.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

module.exports = router;