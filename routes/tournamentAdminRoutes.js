const express = require("express");
const {
  createTournamentAdmin,
  getAllTournamentsAdmin,
  getTournamentAdminById,
  updateTournamentAdmin,
  deleteTournamentAdmin,
} = require("../controllers/tournamentAdminController");

// если у тебя уже есть auth/admin middleware — подключи здесь
// const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// временно без middleware
router.get("/", getAllTournamentsAdmin);
router.post("/", createTournamentAdmin);
router.get("/:id", getTournamentAdminById);
router.put("/:id", updateTournamentAdmin);
router.delete("/:id", deleteTournamentAdmin);

module.exports = router;
