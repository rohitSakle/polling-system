"use strict";
const { poll } = require("../models");

module.exports.create = async (req, res) => {
  const { title, options, createrId, duration } = req.body;
  try {
    const expiresAt = new Date(Date.now() + duration * 60000);
    const createPoll = await poll.create({
      title,
      options,
      createrId,
      duration,
      expiresAt,
    });
    const responseData = {
      ...createPoll?.dataValues,
      roomName: `poll-${createrId}`,
    };
    return res.status(201).json(responseData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.get = async (req, res) => {
  const { id } = req.params;
  try {
    const getPoll = await poll.findOne({
      where: { id },
    });

    if (!getPoll) {
      return res.status(404).json({ message: "Poll not found." });
    }

    // Convert options string to array
    const formattedPoll = {
      ...getPoll.toJSON(),
      options: getPoll.options ? JSON.parse(getPoll.options) : [],
    };

    return res.status(200).json(formattedPoll);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};
