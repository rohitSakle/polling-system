"use strict";
const express = require("express");
const router = express.Router();
const { voteController } = require("../controllers");

router.post("/:pollId/vote", voteController.vote);
router.get("/:pollId/vote", voteController.result);

module.exports = router;
