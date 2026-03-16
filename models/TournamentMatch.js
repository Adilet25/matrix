const mongoose = require("mongoose");

const tournamentMatchSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
      index: true,
    },
    round: {
      type: Number,
      required: true,
    },
    matchNumber: {
      type: Number,
      required: true,
    },
    participant1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TournamentParticipant",
      default: null,
    },
    participant2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TournamentParticipant",
      default: null,
    },
    score1: {
      type: Number,
      default: 0,
    },
    score2: {
      type: Number,
      default: 0,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TournamentParticipant",
      default: null,
    },
    status: {
      type: String,
      enum: ["PENDING", "LIVE", "DONE"],
      default: "PENDING",
    },
    nextMatch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TournamentMatch",
      default: null,
    },
  },
  { timestamps: true },
);

tournamentMatchSchema.index(
  { tournament: 1, round: 1, matchNumber: 1 },
  { unique: true },
);

module.exports = mongoose.model("TournamentMatch", tournamentMatchSchema);
