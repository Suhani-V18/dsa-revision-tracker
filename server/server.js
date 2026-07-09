import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import attempts from "./routes/attempts.js";
import problems from "./routes/problems.js";
import authRoutes from "./routes/auth.js";
const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/attempts", attempts);
app.use("/problems", problems);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
