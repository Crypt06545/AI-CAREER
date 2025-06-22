import mongoose, { Schema } from "mongoose";
const coverLetterSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    jobDescription: { type: String },
    companyName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    status: { type: String, default: "draft" },
  },
  { timestamps: true }
);

export default mongoose.models.CoverLetter || mongoose.model("CoverLetter", coverLetterSchema);
