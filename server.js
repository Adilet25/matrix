const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Сессии
app.use(session({
  secret: process.env.SESSION_SECRET || "matrixsecret",
  resave: false,
  saveUninitialized: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Подключение MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Роуты
const steamAuth = require("./routes/steamAuth");
const faceitRoutes = require("./routes/faceit");
const topPlayersRoutes = require("./routes/topPlayers");
const faceitAuthRoutes = require("./routes/faceitAuth");

app.use("/auth/faceit", faceitAuthRoutes);
app.use("/auth", steamAuth);
app.use("/api/faceit", faceitRoutes);
app.use("/api/top-players", topPlayersRoutes);

// Тест
app.get("/", (req, res) => res.send("API running"));

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);