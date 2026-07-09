import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function explainRecommendation(topScores) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are a concise DSA coach. Given this student's weakest topics and their scores (0-1, higher = weaker), write 2-3 short sentences recommending what to revise next and why. Be specific and encouraging, not generic.

Data: ${JSON.stringify(topScores)}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
