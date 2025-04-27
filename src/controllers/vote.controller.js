"use strict";
const { vote, poll } = require("../models");

module.exports.vote = async (req, res) => {
  const { pollId } = req.params;
  const { options, ip } = req.body;

  const ipAddress = ip || req.ip;
  try {
    const getPoll = await poll.findOne({
      where: {
        id: pollId,
      },
    });
    if (!getPoll) {
      return res.status(404).json({ message: "poll not found." });
    }

    // check if expired
    if (new Date() > getPoll.expiresAt) {
      return res
        .status(400)
        .json({ message: "poll has expired. you can not vote anymore." });
    }

    const existingVote = await vote.findOne({
      where: {
        pollId,
        ipAddress,
      },
    });
    if (existingVote) {
      return res.status(400).json({ message: "You have already voted." });
    }

    if (!getPoll.options.includes(options)) {
      return res.status(400).json({ message: "invalid options." });
    }

    const newVote = await vote.create({ pollId, options, ipAddress });

    // emite events for users who is in room only
    const getData = await this.result();
    console.log(getData);

    req.io
      .to(`poll-${getPoll.createrId}`)
      .emit("votUpdate", { pollId, title: getPoll.title, options });

    return res.status(200).json(newVote);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: error.message });
  }
};

module.exports.result = async (req, res) => {
  const { pollId } = req.params;
  try {
    const getVotes = await vote.findAll({
      where: {
        pollId,
      },
      attributes: ["id", "pollId", "options"],
      include: [
        {
          model: poll,
          attributes: ["id", "title"],
        },
      ],
    });
    const pollInfo = {
      id: getVotes[0]?.poll?.id,
      title: getVotes[0]?.poll?.title,
    };
    const votingResult = {};
    getVotes.forEach((vote) => {
      const option = vote.options;
      if (votingResult[option]) {
        votingResult[option]++;
      } else {
        votingResult[option] = 1;
      }
    });

    const finalResult = {
      ...pollInfo,
      votingResult,
    };

    return res.status(200).json(finalResult);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
