import { getUserOnboardingStatus } from "@/actions/user";
import { industries } from "@/app/data/industries";
import { redirect } from "next/navigation";
import React from "react";
import OnboardingForm from "./_components/OnboardingForm";

const Onboarding = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (isOnboarded) {
    redirect("/dashboard");
  }
  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  );
};

export default Onboarding;
