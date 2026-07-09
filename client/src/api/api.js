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
