import express from "express";
import Attempt from "../models/Attempt.js";
import Problem from "../models/Problem.js";
import {
  calculateTopicScores,
  calculateStreak,
  calculateReadinessScore,
  calculateStreakWithTarget,
} from "../utils/scoringEngine.js";
import { explainRecommendation } from "../utils/explainRecommendation.js";
import { reviewCode } from "../utils/reviewCode.js";
import { generateQuiz } from "../utils/generateQuiz.js";
import { explainWeakness } from "../utils/explainWeakness.js";

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

    let conceptualFeedback = null;
    if (hintsUsed >= 2) {
      try {
        conceptualFeedback = await explainWeakness({
          topic: problem.topic,
          difficulty: problem.difficulty,
          hintsUsed,
          timeTakenMinutes,
          expectedTimeMinutes: problem.expectedTimeMinutes,
        });
      } catch (e) {
        console.log("Weakness explanation failed (non-blocking):", e.message);
      }
    }

    res.status(201).json({ ...attempt.toObject(), conceptualFeedback });
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

router.get("/streak-detailed", async (req, res) => {
  try {
    const target = Number(req.query.target) || 1;
    const attempts = await Attempt.find({});
    const result = calculateStreakWithTarget(attempts, target);
    res.status(200).json(result);
  } catch (e) {
    console.log(`SOMETHING WENT WRONG: ${e}`);
    res.status(500).json({ error: "Failed to calculate streak" });
  }
});

router.post("/review-code", async (req, res) => {
  const { code, topic, difficulty } = req.body;
  if (!code || !topic) {
    return res.status(400).json({ error: "Code and topic are required" });
  }
  try {
    const result = await reviewCode(code, topic, difficulty || "Medium");
    res.status(200).json(result);
  } catch (e) {
    console.log(`SOMETHING WENT WRONG: ${e}`);
    res.status(500).json({ error: "Failed to review code" });
  }
});

router.get("/quiz", async (req, res) => {
  try {
    const attempts = await Attempt.find({});
    const scores = calculateTopicScores(attempts);
    const weakTopics = scores.slice(0, 3).map((s) => s.topic);

    if (weakTopics.length === 0) {
      return res.status(400).json({ error: "Log some attempts first" });
    }

    const quiz = await generateQuiz(weakTopics);
    res.status(200).json({ quiz, weakTopics });
  } catch (e) {
    console.log(`SOMETHING WENT WRONG: ${e}`);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

router.get("/similar/:topic/:excludeId", async (req, res) => {
  try {
    const { topic, excludeId } = req.params;

    const attemptedWell = await Attempt.find({
      topic,
      hintsUsed: { $lte: 1 },
    }).distinct("problemId");

    const similar = await Problem.find({
      topic,
      _id: { $ne: excludeId, $nin: attemptedWell },
    }).limit(3);

    res.status(200).json(similar);
  } catch (e) {
    console.log(`SOMETHING WENT WRONG: ${e}`);
    res.status(500).json({ error: "Failed to fetch similar problems" });
  }
});

router.get("/readiness", async (req, res) => {
  try {
    const attempts = await Attempt.find({});
    const scores = calculateTopicScores(attempts);
    const readiness = calculateReadinessScore(attempts, scores);
    res.status(200).json(readiness);
  } catch (e) {
    console.log(`SOMETHING WENT WRONG: ${e}`);
    res.status(500).json({ error: "Failed to calculate readiness" });
  }
});

router.get("/today-count", async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const count = await Attempt.countDocuments({ date: { $gte: startOfDay } });
    res.status(200).json({ count });
  } catch (e) {
    console.log(`SOMETHING WENT WRONG: ${e}`);
    res.status(500).json({ error: "Failed to count today's attempts" });
  }
});

export default router;
