import mongoose, { Schema } from "mongoose";
const assessmentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quizScore: { type: Number, required: true },
    questions: [{ type: Schema.Types.Mixed }],
    category: { type: String, required: true },
    improvementTip: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Assessment || mongoose.model("Assessment", assessmentSchema);
