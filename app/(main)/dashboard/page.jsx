import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import React from 'react'

const IndustryInsidePage = async() => {
    const { isOnboarded } = await getUserOnboardingStatus();
    if (!isOnboarded) {
      redirect('/onboarding')
    }
  return (
    <div>
      IndustryInsidePage
    </div>
  )
}

export default IndustryInsidePage
