import axios from "axios";

const API_BASE = "http://localhost:5000";

export const createAttempt = (data) => axios.post(`${API_BASE}/attempts`, data);
export const getScores = () => axios.get(`${API_BASE}/attempts/scores`);
export const getProblems = () => axios.get(`${API_BASE}/problems`);
export const createProblem = (data) => axios.post(`${API_BASE}/problems`, data);
export const markReviewed = (topic) =>
  axios.patch(`${API_BASE}/attempts/review/${topic}`);
export const getStreak = () => axios.get(`${API_BASE}/attempts/streak`);
export const bulkImportProblems = (problems) =>
  axios.post(`${API_BASE}/problems/bulk`, { problems });
export const reviewCode = (data) =>
  axios.post(`${API_BASE}/attempts/review-code`, data);
export const getQuiz = () => axios.get(`${API_BASE}/attempts/quiz`);
export const getSimilarProblems = (topic, excludeId) =>
  axios.get(`${API_BASE}/attempts/similar/${topic}/${excludeId}`);
export const getReadiness = () => axios.get(`${API_BASE}/attempts/readiness`);
export const getTodayCount = () =>
  axios.get(`${API_BASE}/attempts/today-count`);
export const getStreakDetailed = (target) =>
  axios.get(`${API_BASE}/attempts/streak-detailed?target=${target}`);
