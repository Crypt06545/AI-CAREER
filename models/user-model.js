import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    clerkUserId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    industry: { type: String, ref: "IndustryInsight", default: "" },
    bio: { type: String, default: "" },
    experience: { type: Number, default: 0 },
    skills: { type: [String], default: [] },
    resume: { type: Schema.Types.ObjectId, ref: "Resume", default: null },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
