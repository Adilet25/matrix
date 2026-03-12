const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "matrixsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));
const leaderboardRoutes = require("./routes/leaderBoard");
const faceitOAuthRoutes = require("./routes/faceitOAuth");
const faceitRoutes = require("./routes/faceit");
const topPlayersRoutes = require("./routes/topPlayers");

app.use("/api/leaderboard", leaderboardRoutes);
app.use("/auth/faceit", faceitOAuthRoutes);
app.use("/api/faceit", faceitRoutes);
app.use("/api/top-players", topPlayersRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
