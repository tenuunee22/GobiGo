import React, { createContext, useState, useContext, useEffect } from 'react';

interface OnboardingContextType {
  isFirstVisit: boolean;
  currentStep: number;
  totalSteps: number;
  stepComplete: boolean;
  isOnboardingDone: boolean;
  startOnboarding: () => void;
  skipOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  completeStep: () => void;
  resetOnboarding: () => void;
}

const defaultContext: OnboardingContextType = {
  isFirstVisit: true,
  currentStep: 0,
  totalSteps: 4,
  stepComplete: false,
  isOnboardingDone: false,
  startOnboarding: () => {},
  skipOnboarding: () => {},
  nextStep: () => {},
  prevStep: () => {},
  completeStep: () => {},
  resetOnboarding: () => {}
};

const OnboardingContext = createContext<OnboardingContextType>(defaultContext);

export const useOnboarding = () => useContext(OnboardingContext);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepComplete, setStepComplete] = useState(false);
  const [isOnboardingDone, setIsOnboardingDone] = useState(false);
  const totalSteps = 4;

  useEffect(() => {
    // Check if user has completed onboarding before
    const onboardingDone = localStorage.getItem('onboardingComplete');
    if (onboardingDone === 'true') {
      setIsFirstVisit(false);
      setIsOnboardingDone(true);
    }
  }, []);

  const startOnboarding = () => {
    setCurrentStep(0);
    setIsFirstVisit(false);
    setIsOnboardingDone(false);
  };

  const skipOnboarding = () => {
    setIsOnboardingDone(true);
    localStorage.setItem('onboardingComplete', 'true');
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
      setStepComplete(false);
    } else {
      // Onboarding complete
      setIsOnboardingDone(true);
      localStorage.setItem('onboardingComplete', 'true');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setStepComplete(false);
    }
  };

  const completeStep = () => {
    setStepComplete(true);
  };

  const resetOnboarding = () => {
    setCurrentStep(0);
    setStepComplete(false);
    setIsOnboardingDone(false);
    setIsFirstVisit(true);
    localStorage.removeItem('onboardingComplete');
  };

  const value = {
    isFirstVisit,
    currentStep,
    totalSteps,
    stepComplete,
    isOnboardingDone,
    startOnboarding,
    skipOnboarding,
    nextStep,
    prevStep,
    completeStep,
    resetOnboarding
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};