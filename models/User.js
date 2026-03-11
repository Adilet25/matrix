const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  steamId: String,
  nickname: String,
  avatar: String,
  faceitId: String,
  elo: Number,
  level: Number,
  country: String,
  trainingStats: {
    counterStrafeScore: Number,
    reactionTime: Number,
    sessions: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);