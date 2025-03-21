// /context/TravellerFormContext.tsx
import React, { createContext, useContext, useState } from "react";

export type TravellerFormData = {
  travelInfo: {
    startLocation: string;
    destinationLocation: string;
  };
  selectedPackage: any; // Use a proper type if available
};

const defaultTravellerData: TravellerFormData = {
  travelInfo: { startLocation: "", destinationLocation: "" },
  selectedPackage: null,
};

type TravellerFormContextType = {
  formData: TravellerFormData;
  updateFormData: (
    section: keyof TravellerFormData,
    data: Partial<TravellerFormData[typeof section]>
  ) => void;
  resetFormData: () => void;
};

const TravellerFormContext = createContext<
  TravellerFormContextType | undefined
>(undefined);

export const TravellerFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] =
    useState<TravellerFormData>(defaultTravellerData);

  const updateFormData = (
    section: keyof TravellerFormData,
    data: Partial<TravellerFormData[typeof section]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const resetFormData = () => {
    setFormData(defaultTravellerData);
  };

  return (
    <TravellerFormContext.Provider
      value={{ formData, updateFormData, resetFormData }}
    >
      {children}
    </TravellerFormContext.Provider>
  );
};

export const useTravellerForm = () => {
  const context = useContext(TravellerFormContext);
  if (!context) {
    throw new Error(
      "useTravellerForm must be used within a TravellerFormProvider"
    );
  }
  return context;
};
