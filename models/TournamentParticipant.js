const mongoose = require("mongoose");

const tournamentParticipantSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    faceitId: {
      type: String,
      default: null,
    },
    nickname: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    elo: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["REGISTERED", "CHECKED_IN", "ELIMINATED", "WINNER"],
      default: "REGISTERED",
    },
    seed: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true },
);

tournamentParticipantSchema.index(
  { tournament: 1, user: 1 },
  { unique: true, partialFilterExpression: { user: { $type: "objectId" } } },
);

module.exports = mongoose.model(
  "TournamentParticipant",
  tournamentParticipantSchema,
);
