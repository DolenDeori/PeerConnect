// /context/FormContext.tsx
import React, { createContext, useContext, useState } from "react";

export type PackageFormData = {
  locationInfo: {
    pickupPoint: string;
    deliveryPoint: string;
  };
  packageDetails: {
    packageType: string;
    packageSize: string;
    packageWeight: string;
    packageContent: string;
    waitingPeriod: string;
  };
  receiverDetails: {
    receiverName: string;
    receiverPhone: string;
  };
};

type FormContextType = {
  formData: PackageFormData;
  updateFormData: (
    section: keyof PackageFormData,
    data: Partial<PackageFormData[typeof section]>
  ) => void;
  resetFormData: () => void;
};

const defaultFormData: PackageFormData = {
  locationInfo: { pickupPoint: "", deliveryPoint: "" },
  packageDetails: {
    packageType: "",
    packageSize: "",
    packageWeight: "",
    packageContent: "",
    waitingPeriod: "",
  },
  receiverDetails: { receiverName: "", receiverPhone: "" },
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<PackageFormData>(defaultFormData);

  const updateFormData = (
    section: keyof PackageFormData,
    data: Partial<PackageFormData[typeof section]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const resetFormData = () => {
    setFormData(defaultFormData);
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData, resetFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};
