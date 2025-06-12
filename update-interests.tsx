import React from 'react';
import OnboardingScreen from './onboarding'; // Assuming onboarding.tsx is in the same directory

export default function UpdateInterestsScreen() {
  // This screen will effectively render the onboarding flow,
  // but starting from a specific step and with a different completion behavior.
  return (
    <OnboardingScreen
      initialStep={1} // Start from "Pick Your Learning Paths"
      onCompleteRoute="/(tabs)" // Or a specific profile route if preferred
      isUpdateFlow={true}
    />
  );
}
