const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      default: "",
    },

    mode: {
      type: String,
      enum: ["1v1", "2v2", "5v5"],
      default: "5v5",
    },

    status: {
      type: String,
      enum: ["DRAFT", "OPEN", "LIVE", "FINISHED"],
      default: "OPEN",
    },

    region: {
      type: String,
      default: "Online",
    },

    prize: {
      type: String,
      default: "",
    },

    maxParticipants: {
      type: Number,
      default: 8,
    },

    startDate: {
      type: Date,
      default: null,
    },

    checkInEnabled: {
      type: Boolean,
      default: false,
    },

    isPublic: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Tournament", tournamentSchema);
