const Tournament = require("../models/Tournament");
const TournamentParticipant = require("../models/TournamentParticipant");
const TournamentMatch = require("../models/TournamentMatch");

const slugify = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");

const createTournament = async (req, res) => {
  try {
    const {
      title,
      description,
      mode,
      prize,
      region,
      maxParticipants,
      startDate,
      checkInEnabled,
      isPublic,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    let slug = slugify(title);

    if (!slug) {
      slug = `tournament-${Date.now()}`;
    }

    const existing = await Tournament.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const tournament = await Tournament.create({
      title: title.trim(),
      slug,
      description: description || "",
      mode: mode || "5v5",
      prize: prize || "",
      region: region || "Online",
      maxParticipants: Number(maxParticipants) || 8,
      startDate: startDate || null,
      checkInEnabled: Boolean(checkInEnabled),
      isPublic: isPublic !== undefined ? Boolean(isPublic) : true,
      createdBy: req.user?._id || null,
    });

    return res.status(201).json(tournament);
  } catch (error) {
    console.error("createTournament error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find({ isPublic: true }).sort({
      createdAt: -1,
    });

    return res.json(tournaments);
  } catch (error) {
    console.error("getTournaments error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getTournamentBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const tournament = await Tournament.findOne({ slug });

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    const participantsCount = await TournamentParticipant.countDocuments({
      tournament: tournament._id,
    });

    return res.json({
      ...tournament.toObject(),
      participantsCount,
    });
  } catch (error) {
    console.error("getTournamentBySlug error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const joinTournament = async (req, res) => {
  try {
    const { slug } = req.params;

    const tournament = await Tournament.findOne({ slug });

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    if (tournament.status !== "OPEN") {
      return res.status(400).json({ message: "Tournament is not open" });
    }

    const participantsCount = await TournamentParticipant.countDocuments({
      tournament: tournament._id,
    });

    if (participantsCount >= tournament.maxParticipants) {
      return res.status(400).json({ message: "Tournament is full" });
    }

    if (req.user?._id) {
      const existingByUser = await TournamentParticipant.findOne({
        tournament: tournament._id,
        user: req.user._id,
      });

      if (existingByUser) {
        return res.status(400).json({ message: "Already joined" });
      }
    }

    const nickname =
      req.user?.nickname || req.body?.nickname || "Unknown Player";

    const participant = await TournamentParticipant.create({
      tournament: tournament._id,
      user: req.user?._id || null,
      faceitId: req.user?.faceitId || null,
      nickname,
      avatar: req.user?.avatar || "",
      country: req.user?.country || "",
      elo: req.user?.elo || 0,
      level: req.user?.level || 0,
      status: "REGISTERED",
    });

    return res.status(201).json(participant);
  } catch (error) {
    console.error("joinTournament error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getTournamentParticipants = async (req, res) => {
  try {
    const { slug } = req.params;

    const tournament = await Tournament.findOne({ slug });

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    const participants = await TournamentParticipant.find({
      tournament: tournament._id,
    }).sort({ createdAt: 1 });

    return res.json(participants);
  } catch (error) {
    console.error("getTournamentParticipants error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const generateBracket = async (req, res) => {
  try {
    const { slug } = req.params;

    const tournament = await Tournament.findOne({ slug });

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    const existingMatches = await TournamentMatch.countDocuments({
      tournament: tournament._id,
    });

    if (existingMatches > 0) {
      return res.status(400).json({ message: "Bracket already generated" });
    }

    const participants = await TournamentParticipant.find({
      tournament: tournament._id,
    }).sort({ elo: -1, createdAt: 1 });

    if (participants.length < 2) {
      return res.status(400).json({ message: "Not enough participants" });
    }

    const bracketSize = 2 ** Math.ceil(Math.log2(participants.length));
    const paddedParticipants = [...participants];

    while (paddedParticipants.length < bracketSize) {
      paddedParticipants.push(null);
    }

    const firstRoundMatches = [];

    for (let i = 0; i < paddedParticipants.length; i += 2) {
      const participant1 = paddedParticipants[i];
      const participant2 = paddedParticipants[i + 1];

      let winner = null;
      let status = "PENDING";

      if (participant1 && !participant2) {
        winner = participant1._id;
        status = "DONE";
      } else if (!participant1 && participant2) {
        winner = participant2._id;
        status = "DONE";
      }

      const match = await TournamentMatch.create({
        tournament: tournament._id,
        round: 1,
        matchNumber: i / 2 + 1,
        participant1: participant1?._id || null,
        participant2: participant2?._id || null,
        winner,
        status,
      });

      firstRoundMatches.push(match);
    }

    let currentRoundMatches = firstRoundMatches;
    let round = 2;

    while (currentRoundMatches.length > 1) {
      const nextRoundMatches = [];

      for (let i = 0; i < currentRoundMatches.length; i += 2) {
        const nextMatch = await TournamentMatch.create({
          tournament: tournament._id,
          round,
          matchNumber: i / 2 + 1,
          status: "PENDING",
        });

        currentRoundMatches[i].nextMatch = nextMatch._id;
        await currentRoundMatches[i].save();

        if (currentRoundMatches[i + 1]) {
          currentRoundMatches[i + 1].nextMatch = nextMatch._id;
          await currentRoundMatches[i + 1].save();
        }

        nextRoundMatches.push(nextMatch);
      }

      currentRoundMatches = nextRoundMatches;
      round += 1;
    }

    tournament.status = "LIVE";
    await tournament.save();

    return res.json({ message: "Bracket generated successfully" });
  } catch (error) {
    console.error("generateBracket error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getTournamentMatches = async (req, res) => {
  try {
    const { slug } = req.params;

    const tournament = await Tournament.findOne({ slug });

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    const matches = await TournamentMatch.find({
      tournament: tournament._id,
    })
      .populate("participant1", "nickname avatar elo level country")
      .populate("participant2", "nickname avatar elo level country")
      .populate("winner", "nickname avatar")
      .sort({ round: 1, matchNumber: 1 });

    return res.json(matches);
  } catch (error) {
    console.error("getTournamentMatches error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
const setMatchResult = async (req, res) => {
  try {
    const { slug, matchId } = req.params;
    const { score1, score2, winnerSide } = req.body;

    const tournament = await Tournament.findOne({ slug });

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    const match = await TournamentMatch.findOne({
      _id: matchId,
      tournament: tournament._id,
    });

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (!match.participant1 || !match.participant2) {
      return res
        .status(400)
        .json({ message: "Cannot set result for incomplete match" });
    }

    const parsedScore1 = Number(score1);
    const parsedScore2 = Number(score2);

    if (Number.isNaN(parsedScore1) || Number.isNaN(parsedScore2)) {
      return res.status(400).json({ message: "Scores must be valid numbers" });
    }

    if (!["participant1", "participant2"].includes(winnerSide)) {
      return res
        .status(400)
        .json({ message: "winnerSide must be participant1 or participant2" });
    }

    const winnerId =
      winnerSide === "participant1" ? match.participant1 : match.participant2;

    const loserId =
      winnerSide === "participant1" ? match.participant2 : match.participant1;

    match.score1 = parsedScore1;
    match.score2 = parsedScore2;
    match.winner = winnerId;
    match.status = "DONE";

    await match.save();

    if (loserId) {
      await TournamentParticipant.findByIdAndUpdate(loserId, {
        status: "ELIMINATED",
      });
    }

    if (winnerId) {
      await TournamentParticipant.findByIdAndUpdate(winnerId, {
        status: "REGISTERED",
      });
    }

    if (match.nextMatch) {
      const nextMatch = await TournamentMatch.findById(match.nextMatch);

      if (nextMatch) {
        const previousRoundMatches = await TournamentMatch.find({
          tournament: tournament._id,
          nextMatch: nextMatch._id,
        }).sort({ matchNumber: 1 });

        if (previousRoundMatches.length > 0) {
          const currentMatchIndex = previousRoundMatches.findIndex(
            (m) => String(m._id) === String(match._id),
          );

          if (currentMatchIndex === 0) {
            nextMatch.participant1 = winnerId;
          } else {
            nextMatch.participant2 = winnerId;
          }

          const p1Exists = !!nextMatch.participant1;
          const p2Exists = !!nextMatch.participant2;

          if ((p1Exists && !p2Exists) || (!p1Exists && p2Exists)) {
            nextMatch.status = "PENDING";
          }

          await nextMatch.save();
        }
      }
    } else {
      tournament.status = "FINISHED";
      await tournament.save();

      if (winnerId) {
        await TournamentParticipant.findByIdAndUpdate(winnerId, {
          status: "WINNER",
        });
      }
    }

    const updatedMatch = await TournamentMatch.findById(match._id)
      .populate("participant1", "nickname avatar elo level country")
      .populate("participant2", "nickname avatar elo level country")
      .populate("winner", "nickname avatar");

    return res.json({
      message: "Match result saved successfully",
      match: updatedMatch,
    });
  } catch (error) {
    console.error("setMatchResult error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTournament,
  getTournaments,
  getTournamentBySlug,
  joinTournament,
  getTournamentParticipants,
  generateBracket,
  getTournamentMatches,
  setMatchResult,
};
