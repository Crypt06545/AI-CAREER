import ConnectDB from "@/config/db/db";
import industryInsightMode from "@/models/industryInsight-mode";
import userModel from "@/models/user-model";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateAIInsights = async (industry) => {
  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  return JSON.parse(cleanedText);
};

export async function getIndustryInsigts(params) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    await ConnectDB();

    const user = await userModel.findOne({ clerkUserId: userId }).lean();
    if (!user) throw new Error("User not found");
    if (!user.industry) throw new Error("User has no industry set");

    // Check if insight already exists
    let industryInsight = await industryInsightMode
      .findOne({
        industry: { $regex: new RegExp(`^${user.industry}$`, "i") },
      })
      .lean();

    if (!industryInsight) {
      const insights = await generateAIInsights(user.industry);

      const createdInsight = await industryInsightMode.create({
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      // Convert to plain object manually
      industryInsight = createdInsight.toObject();
    }

    // ✅ Convert all fields to plain JSON-safe values
    return {
      ...industryInsight,
      _id: industryInsight._id?.toString(),
      createdAt: industryInsight.createdAt?.toISOString(),
      updatedAt: industryInsight.updatedAt?.toISOString(),
      nextUpdate: industryInsight.nextUpdate?.toISOString(),
    };
  } catch (error) {
    console.error("getIndustryInsigts Error:", error);
    throw new Error("Failed to fetch industry insights");
  }
}
