import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function explainWeakness({
  topic,
  difficulty,
  hintsUsed,
  timeTakenMinutes,
  expectedTimeMinutes,
}) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `A student solved a ${difficulty} ${topic} problem but needed ${hintsUsed} hints and took ${timeTakenMinutes} minutes (expected: ${expectedTimeMinutes}).

In 2 sentences, identify the most likely underlying conceptual gap for this topic (not this specific problem — the general pattern, e.g. "recognizing when to use two pointers vs a hash map"), and name one specific concept to review. Be specific to the topic, not generic.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
