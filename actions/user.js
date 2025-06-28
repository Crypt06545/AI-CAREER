"use server";

import ConnectDB from "@/config/db/db";
import userModel from "@/models/user-model";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import industryInsightMode from "@/models/industryInsight-mode";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    await ConnectDB();

    // 1. Validate required fields
    if (!data.industry || typeof data.industry !== "string") {
      throw new Error("Industry is required");
    }

    // 2. Find the user by clerkUserId
    const user = await userModel.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");

    // 3. Check if industry insight exists
    let industryInsight = await industryInsightMode.findOne({
      industry: data.industry,
    });

    // 4. If not, create it with generated insights
    if (!industryInsight) {
      const insights = await generateAIInsights(data.industry);

      // Correct Mongoose create syntax (remove 'data' wrapper)
      industryInsight = await industryInsightMode.create({
        industry: data.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      });
    }

    // 5. Update the user
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

    // Convert MongoDB documents to plain objects
    function convertDoc(doc) {
      if (!doc) return null;
      const result = doc.toObject ? doc.toObject() : doc;
      return {
        ...result,
        _id: result._id.toString(),
        createdAt: result.createdAt?.toISOString(),
        updatedAt: result.updatedAt?.toISOString(),
        nextUpdate: result.nextUpdate?.toISOString(),
      };
    }

    return {
      success: true,
      updatedUser: convertDoc(updatedUser),
      industryInsight: convertDoc(industryInsight),
    };
  } catch (error) {
    console.error("Error updating user and industry:", error);
    throw new Error(`Failed to update profile: ${error.message}`);
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
