const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nickname: String,
  avatar: String,
  faceitId: { type: String, unique: true },
  elo: Number,
  level: Number,
  country: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);