const router = require("express").Router();
const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;
const User = require("../models/User");

// Steam стратегия
passport.use(new SteamStrategy({
  returnURL: "http://localhost:5000/auth/steam/return",
  realm: "http://localhost:5000/",
  apiKey: process.env.STEAM_API_KEY
},
async (identifier, profile, done) => {
  try {
    let user = await User.findOne({ steamId: profile.id });
    if (!user) {
      user = new User({
        steamId: profile.id,
        nickname: profile.displayName,
        avatar: profile.photos[2]?.value || null
      });
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

// Роуты Steam
router.get("/steam", passport.authenticate("steam"));

router.get("/steam/return",
  passport.authenticate("steam", { failureRedirect: "/" }),
  (req, res) => {
    res.json({ message: "Logged in via Steam", user: req.user });
  }
);

module.exports = router;