"use strict";
const express = require("express");
const router = express.Router();
const { pollController } = require("../controllers");

router.post("/poll", pollController.create);
router.get("/poll/:id", pollController.get);

module.exports = router;
