import mongoose, { Schema } from "mongoose";
const resumeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", unique: true },
    content: { type: String },
    atsScore: { type: Number },
    feedback: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Resume || mongoose.model("Resume", resumeSchema);
