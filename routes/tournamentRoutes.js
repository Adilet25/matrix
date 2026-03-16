const express = require("express");

const {
  createTournament,
  getTournaments,
  getTournamentBySlug,
  joinTournament,
  getTournamentParticipants,
  generateBracket,
  getTournamentMatches,
  setMatchResult,
} = require("../controllers/tournamentController");

const router = express.Router();

router.get("/", getTournaments);
router.post("/", createTournament);

router.get("/:slug", getTournamentBySlug);
router.post("/:slug/join", joinTournament);
router.get("/:slug/participants", getTournamentParticipants);
router.post("/:slug/generate-bracket", generateBracket);
router.get("/:slug/matches", getTournamentMatches);

router.post("/:slug/matches/:matchId/result", setMatchResult);

module.exports = router;
