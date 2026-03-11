const router = require("express").Router();
const axios = require("axios");
const crypto = require("crypto");
const User = require("../models/User");

function buildAuthorizeUrl(state) {
  const params = new URLSearchParams({
    client_id: process.env.FACEIT_CLIENT_ID,
    redirect_uri: process.env.FACEIT_REDIRECT_URI,
    response_type: "code",
    scope: "openid profile email membership",
    state,
  });

  return `https://accounts.faceit.com?${params.toString()}`;
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
    const basicAuth = Buffer.from(
      `${process.env.FACEIT_CLIENT_ID}:${process.env.FACEIT_CLIENT_SECRET}`
    ).toString("base64");

    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.FACEIT_REDIRECT_URI,
    });

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

    const userInfoResponse = await axios.get(
      "https://api.faceit.com/auth/v1/resources/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const profile = userInfoResponse.data;

    let user = await User.findOne({ faceitId: profile.sub });

    if (!user) {
      user = new User({
        nickname: profile.nickname || profile.given_name || "FaceitUser",
        faceitId: profile.sub,
        avatar: profile.picture || "",
        country: (profile.locale || "unknown").toLowerCase(),
      });
    } else {
      user.nickname = profile.nickname || user.nickname;
      user.avatar = profile.picture || user.avatar;
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