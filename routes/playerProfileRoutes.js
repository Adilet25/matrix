const express = require("express");
const { getPlayerProfile } = require("../controllers/playerProfileController");

const router = express.Router();

router.get("/:nickname/profile", getPlayerProfile);

module.exports = router;
