import ConnectDB from "@/config/db/db"
import userModel from "@/models/user-model"
import { currentUser } from "@clerk/nextjs/server"

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) return null;

  try {
    // 1. Connect to MongoDB
    await ConnectDB();

    // 2. Try to find user by clerkUserId
    const existingUser = await userModel.findOne({ clerkUserId: user.id });

    if (existingUser) {
      return existingUser;
    }

    // 3. If not found, create new user
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    const newUser = await userModel.create({
      clerkUserId: user.id,
      name,
      email: user.emailAddresses[0]?.emailAddress || "",
      imageUrl: user.imageUrl,
    });

    return newUser;
  } catch (error) {
    console.error("Error checking or creating user:", error.message);
    return null;
  }
};