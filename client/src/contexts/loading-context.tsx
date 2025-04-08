import React, { createContext, useContext, useState, ReactNode } from "react";
import { LoadingScreen } from "@/components/shared/food-loader";

type FoodType = "random" | "burger" | "pizza" | "noodles" | "donut";

interface LoadingContextType {
  isLoading: boolean;
  loadingText: string;
  foodType: FoodType;
  showLoading: (text?: string, foodType?: FoodType) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");
  const [foodType, setFoodType] = useState<FoodType>("random");

  const showLoading = (text = "Loading...", foodType: FoodType = "random") => {
    setLoadingText(text);
    setFoodType(foodType);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingText,
        foodType,
        showLoading,
        hideLoading,
      }}
    >
      {children}
      {isLoading && <LoadingScreen text={loadingText} foodType={foodType} />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}