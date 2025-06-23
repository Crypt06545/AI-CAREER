"use server";

import ConnectDB from "@/config/db/db";
import userModel from "@/models/user-model";
import { auth } from "@clerk/nextjs/server";
// import { generateAIInsights } from "./dashboard";
import { revalidatePath } from "next/cache";
import industryInsightMode from "@/models/industryInsight-mode";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    await ConnectDB();

    // 1. Find the user by clerkUserId
    const user = await userModel.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");

    // 2. Check if industry insight exists
    let industryInsight = await industryInsightMode.findOne({
      industry: data.industry,
    });

    // 3. If not, create it with default mock data
    if (!industryInsight) {
      industryInsight = await industryInsightMode.create({
        industry: data.industry,
        salaryRanges: [],
        growthRate: 0,
        demandLevel: "Unknown",
        topSkills: [],
        marketOutlook: "Not available",
        keyTrends: [],
        recommendedSkills: [],
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    }

    // 4. Update the user
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        industry: data.industry,
        bio: data.bio,
        experience: data.experience,
        skills: data.skills,
      },
      { new: true }
    );

    revalidatePath("/");

    return { updatedUser, industryInsight };
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    await ConnectDB();

    // Find only the `industry` field for performance
    const user = await userModel.findOne(
      { clerkUserId: userId },
      { industry: 1 } // only return industry
    );

    if (!user) throw new Error("User not found");

    return {
      isOnboarded: !!user.industry, // true if industry is not empty
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error.message);
    throw new Error("Failed to check onboarding status");
  }
}
