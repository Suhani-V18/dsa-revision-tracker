import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    topic: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    timeTakenMinutes: { type: Number, required: true },
    hintsUsed: { type: Number, default: 0 },
    solvedIndependently: { type: Boolean, required: true },
    confidenceRating: { type: Number, min: 1, max: 5 },
    date: { type: Date, default: Date.now },
    expectedTimeMinutes: { type: Number, required: true },
  },
  { timestamps: true }
);

const Attempt = mongoose.model("Attempt", attemptSchema);
export default Attempt;
