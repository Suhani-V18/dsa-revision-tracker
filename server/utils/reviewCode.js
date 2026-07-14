import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function reviewCode(code, topic, difficulty, timeTakenMinutes) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const timeContext = timeTakenMinutes
    ? `The student took ${timeTakenMinutes} minutes to write this.`
    : "";

  const prompt = `You are a strict but encouraging DSA interview coach. A student submitted this ${difficulty} ${topic} solution. ${timeContext}

DO NOT reveal the fix directly. Instead:
1. Point to the general area/line where an issue might exist (without stating the fix).
2. Ask 1-2 guiding questions that would help them find it themselves.
3. If the code looks correct, say so and note one thing they could improve.
${
  timeTakenMinutes
    ? "4. If the time taken seems high for this difficulty, briefly mention that too."
    : ""
}

Then, separately, name exactly 3 well-known, real LeetCode problems that use the same underlying pattern/technique as this ${topic} problem. Use only real, well-known problem titles — do not invent problem names.

Return ONLY valid JSON, no markdown formatting, no backticks, in this exact shape:
{
  "feedback": "...",
  "similarProblems": ["Problem Title 1", "Problem Title 2", "Problem Title 3"]
}

Code:
${code}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}
