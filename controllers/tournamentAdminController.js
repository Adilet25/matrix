const Tournament = require("../models/Tournament");

const slugify = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");

const createTournamentAdmin = async (req, res) => {
  try {
    const {
      title,
      description,
      mode,
      status,
      region,
      prize,
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

    const exists = await Tournament.findOne({ slug });
    if (exists) {
      slug = `${slug}-${Date.now()}`;
    }

    const tournament = await Tournament.create({
      title: title.trim(),
      slug,
      description: description || "",
      mode: mode || "5v5",
      status: status || "OPEN",
      region: region || "Online",
      prize: prize || "",
      maxParticipants: Number(maxParticipants) || 8,
      startDate: startDate || null,
      checkInEnabled: Boolean(checkInEnabled),
      isPublic: isPublic !== undefined ? Boolean(isPublic) : true,
      createdBy: req.user?._id || null,
    });

    return res.status(201).json(tournament);
  } catch (error) {
    console.error("createTournamentAdmin error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllTournamentsAdmin = async (req, res) => {
  try {
    const tournaments = await Tournament.find().sort({ createdAt: -1 });
    return res.json(tournaments);
  } catch (error) {
    console.error("getAllTournamentsAdmin error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getTournamentAdminById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    return res.json(tournament);
  } catch (error) {
    console.error("getTournamentAdminById error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateTournamentAdmin = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    const {
      title,
      description,
      mode,
      status,
      region,
      prize,
      maxParticipants,
      startDate,
      checkInEnabled,
      isPublic,
    } = req.body;

    if (title !== undefined) {
      tournament.title = title.trim();

      const newSlugBase = slugify(title);
      if (newSlugBase && newSlugBase !== tournament.slug) {
        let newSlug = newSlugBase;

        const slugExists = await Tournament.findOne({
          slug: newSlug,
          _id: { $ne: tournament._id },
        });

        if (slugExists) {
          newSlug = `${newSlug}-${Date.now()}`;
        }

        tournament.slug = newSlug;
      }
    }

    if (description !== undefined) tournament.description = description;
    if (mode !== undefined) tournament.mode = mode;
    if (status !== undefined) tournament.status = status;
    if (region !== undefined) tournament.region = region;
    if (prize !== undefined) tournament.prize = prize;
    if (maxParticipants !== undefined) {
      tournament.maxParticipants =
        Number(maxParticipants) || tournament.maxParticipants;
    }
    if (startDate !== undefined) tournament.startDate = startDate || null;
    if (checkInEnabled !== undefined) {
      tournament.checkInEnabled = Boolean(checkInEnabled);
    }
    if (isPublic !== undefined) {
      tournament.isPublic = Boolean(isPublic);
    }

    await tournament.save();

    return res.json(tournament);
  } catch (error) {
    console.error("updateTournamentAdmin error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteTournamentAdmin = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    await tournament.deleteOne();

    return res.json({ message: "Tournament deleted successfully" });
  } catch (error) {
    console.error("deleteTournamentAdmin error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTournamentAdmin,
  getAllTournamentsAdmin,
  getTournamentAdminById,
  updateTournamentAdmin,
  deleteTournamentAdmin,
};
