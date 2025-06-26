"use server";

import ConnectDB from "@/config/db/db";
import userModel from "@/models/user-model";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import industryInsightMode from "@/models/industryInsight-mode";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    await ConnectDB();

    const { industry, bio, experience, skills } = data;

    if (!industry || typeof industry !== "string") {
      throw new Error("Invalid industry format");
    }

    const user = await userModel.findOne({ clerkUserId: userId }).lean();
    if (!user) throw new Error("User not found");

    let industryInsight = await industryInsightMode.findOne({ industry }).lean();

    if (!industryInsight) {
      const created = await industryInsightMode.create({
        industry,
        salaryRanges: [],
        growthRate: 0,
        demandLevel: "Unknown",
        topSkills: [],
        marketOutlook: "Not available",
        keyTrends: [],
        recommendedSkills: [],
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      industryInsight = created.toObject();
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(
        user._id,
        { industry, bio, experience, skills },
        { new: true }
      )
      .lean();

    revalidatePath("/");

    function convertDoc(doc) {
      if (!doc) return null;
      return {
        ...doc,
        _id: doc._id.toString(),
        createdAt: doc.createdAt?.toISOString(),
        updatedAt: doc.updatedAt?.toISOString(),
        nextUpdate: doc.nextUpdate?.toISOString(),
      };
    }

    return {
      success: true,
      updatedUser: convertDoc(updatedUser),
      industryInsight: convertDoc(industryInsight),
    };
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile: " + error.message);
  }
}


export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    await ConnectDB();

    const user = await userModel
      .findOne({ clerkUserId: userId }, { industry: 1 })
      .lean();

    if (!user) throw new Error("User not found");

    return {
      isOnboarded: !!user.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error.message);
    throw new Error("Failed to check onboarding status");
  }
}
