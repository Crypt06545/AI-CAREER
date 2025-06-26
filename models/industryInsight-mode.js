import mongoose, { Schema } from "mongoose";
const industryInsightSchema = new Schema(
  {
    industry: { type: String, required: true },
    salaryRanges: [{ type: Schema.Types.Mixed }],
    growthRate: { type: Number },
    demandLevel: { type: String },
    topSkills: [{ type: String }],
    marketOutlook: { type: String },
    keyTrends: [{ type: String }],
    recommendedSkills: [{ type: String }],
    nextUpdate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.IndustryInsight ||
  mongoose.model("IndustryInsight", industryInsightSchema);
