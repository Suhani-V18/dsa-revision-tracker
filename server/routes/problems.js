import express from "express";
import Problem from "../models/Problem.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { title, topic, difficulty, link, expectedTimeMinutes } = req.body;

  try {
    const problem = new Problem({
      title,
      topic,
      difficulty,
      link,
      expectedTimeMinutes,
    });

    await problem.save();
    res.status(201).json(problem);
  } catch (e) {
    console.log(`SOMETHING WENT WRONG: ${e}`);
    res.status(500).json({ error: "Failed to save attempt" });
  }
});

router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find({});
    res.status(200).json(problems);
  } catch (e) {
    console.log(`SOMETHING WENT WRONG: ${e}`);
    res.status(500).json({ error: "Failed to fetch problems" });
  }
});

router.post("/bulk", async (req, res) => {
  const { problems } = req.body;

  if (!Array.isArray(problems) || problems.length === 0) {
    return res.status(400).json({ error: "No problems provided" });
  }

  try {
    const inserted = await Problem.insertMany(problems, { ordered: false });
    res.status(201).json({ count: inserted.length, problems: inserted });
  } catch (e) {
    console.log(`SOMETHING WENT WRONG: ${e}`);
    res.status(500).json({ error: "Bulk import failed", details: e.message });
  }
});

export default router;
