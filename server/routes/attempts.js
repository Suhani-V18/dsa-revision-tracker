import express from "express";
import Attempt from "../models/Attempt.js";
import Problem from "../models/Problem.js";
import {
  calculateTopicScores,
  calculateStreak,
} from "../utils/scoringEngine.js";
import { explainRecommendation } from "../utils/explainRecommendation.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    problemId,
    timeTakenMinutes,
    hintsUsed,
    solvedIndependently,
    confidenceRating,
  } = req.body;

  try {
    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    const attempt = new Attempt({
      problemId,
      topic: problem.topic,
      difficulty: problem.difficulty,
      expectedTimeMinutes: problem.expectedTimeMinutes,
      timeTakenMinutes,
      hintsUsed,
      solvedIndependently,
      confidenceRating,
    });

    await attempt.save();
    res.status(201).json(attempt);
  } catch (e) {
    console.log(`SOMETHING WENT WRONG: ${e}`);
    res.status(500).json({ error: "Failed to save attempt" });
  }
});

router.get("/", async (req, res) => {
  try {
    const attempts = await Attempt.find({});
    res.status(200).json(attempts);
  } catch (e) {
    console.log(`SOMETHING WENT WRONG: ${e}`);
    res.status(500).json({ error: "Failed to fetch attempts" });
  }
});

router.get("/scores", async (req, res) => {
  try {
    const attempts = await Attempt.find({});
    const scores = calculateTopicScores(attempts);
    res.status(200).json(scores);
  } catch (e) {
    console.log(`SOMETHING WENT WRONG: ${e}`);
    res.status(500).json({ error: "Failed to calculate scores" });
  }
});

router.get("/explain", async (req, res) => {
  try {
    const attempts = await Attempt.find({});
    const scores = calculateTopicScores(attempts);
    const topThree = scores.slice(0, 3);
    const explanation = await explainRecommendation(topThree);
    res.status(200).json({ explanation, topThree });
  } catch (e) {
    console.log(`SOMETHING WENT WRONG: ${e}`);
    res.status(500).json({ error: "Failed to generate explanation" });
  }
});

router.patch("/review/:topic", async (req, res) => {
  try {
    await Attempt.updateMany(
      { topic: req.params.topic },
      { $set: { date: new Date() } }
    );
    res.status(200).json({ message: "Marked as reviewed" });
  } catch (e) {
    console.log(`SOMETHING WENT WRONG: ${e}`);
    res.status(500).json({ error: "Failed to mark reviewed" });
  }
});

router.get("/streak", async (req, res) => {
  try {
    const attempts = await Attempt.find({});
    const streak = calculateStreak(attempts);
    res.status(200).json({ streak });
  } catch (e) {
    console.log(`SOMETHING WENT WRONG: ${e}`);
    res.status(500).json({ error: "Failed to calculate streak" });
  }
});

export default router;
