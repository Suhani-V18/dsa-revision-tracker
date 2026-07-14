import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateQuiz(weakTopics) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Generate a 5-question DSA concept quiz (not coding problems, just concept/theory questions) focused on these weak topics: ${weakTopics.join(
    ", "
  )}.

Return ONLY valid JSON, no markdown formatting, no backticks, in this exact shape:
[
  { "question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0 }
]`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}
