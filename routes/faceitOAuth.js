const router = require("express").Router();
const axios = require("axios");
const crypto = require("crypto");
const User = require("../models/User");

function base64url(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function generateCodeVerifier() {
  return base64url(crypto.randomBytes(64));
}

function generateCodeChallenge(verifier) {
  return base64url(crypto.createHash("sha256").update(verifier).digest());
}

function buildAuthorizeUrl(state, codeChallenge) {
  const params = new URLSearchParams({
    client_id: process.env.FACEIT_CLIENT_ID,
    redirect_uri: process.env.FACEIT_REDIRECT_URI,
    response_type: "code",
    scope: "openid",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  return `https://accounts.faceit.com/oauth/authorize?${params.toString()}`;
}

// 🔐 LOGIN
router.get("/login", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  req.session.faceitState = state;
  req.session.faceitCodeVerifier = codeVerifier;

  res.redirect(buildAuthorizeUrl(state, codeChallenge));
});

// 🔁 CALLBACK
router.get("/callback", async (req, res) => {
  const { code, state, error } = req.query;

  if (error) return res.status(400).json({ error });
  if (!code) return res.status(400).json({ error: "No code" });

  if (state !== req.session.faceitState) {
    return res.status(400).json({ error: "Invalid state" });
  }

  try {
    const basicAuth = Buffer.from(
      `${process.env.FACEIT_CLIENT_ID}:${process.env.FACEIT_CLIENT_SECRET}`,
    ).toString("base64");

    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.FACEIT_REDIRECT_URI,
      code_verifier: req.session.faceitCodeVerifier,
    });

    const tokenRes = await axios.post(
      "https://api.faceit.com/auth/v1/oauth/token",
      tokenParams.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicAuth}`,
        },
      },
    );

    const access_token = tokenRes.data.access_token;

    const userInfo = await axios.get(
      "https://api.faceit.com/auth/v1/resources/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    const faceitId = userInfo.data.sub;

    const playerRes = await axios.get(
      `https://open.faceit.com/data/v4/players/${faceitId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FACEIT_KEY}`,
        },
      },
    );

    const player = playerRes.data;
    const cs2 = player.games?.cs2 || player.games?.csgo || {};

    let user = await User.findOne({ faceitId });

    if (!user) {
      user = new User({
        faceitId,
        nickname: player.nickname,
        avatar: player.avatar,
        elo: cs2.faceit_elo || 0,
        level: cs2.skill_level || 0,
        country: (player.country || "unknown").toLowerCase(),
      });
    } else {
      user.nickname = player.nickname;
      user.avatar = player.avatar;
      user.elo = cs2.faceit_elo || 0;
      user.level = cs2.skill_level || 0;
      user.country = (player.country || "unknown").toLowerCase();
    }

    await user.save();

    // 🔥 ВАЖНО: создаем TOKEN вместо reliance на cookie
    const token = Buffer.from(user._id.toString()).toString("base64");

    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/success?token=${token}`,
    );
  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ error: "OAuth failed" });
  }
});

// 🔐 СОЗДАНИЕ СЕССИИ ПО TOKEN
router.post("/session", async (req, res) => {
  const { token } = req.body;

  try {
    const userId = Buffer.from(token, "base64").toString("utf-8");

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    req.session.userId = user._id;

    res.json({ success: true });
  } catch {
    res.status(400).json({ error: "Invalid token" });
  }
});

// 👤 ME
router.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not auth" });
  }

  const user = await User.findById(req.session.userId);
  res.json(user);
});

// 🚪 LOGOUT
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

module.exports = router;
