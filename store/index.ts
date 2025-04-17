import { create } from "zustand";

interface SenderFormData {
  pickupLocation: string;
  deliveryLocation: string;
  packageWeight: number;
  packageDimensions: string;
  packageType: string;
  packageContent: string;
  packageDesription?: string;
  ReceiverInfo: {
    name: string;
    phone: string;
    email?: string;
    alternativePhone?: string;
  };
}

interface SenderFormState {
  data: Partial<SenderFormData>;
  updateData: (key: keyof SenderFormData, value: string | number) => void;
  resetFrom: () => void;
}

export const useFormStore = create<SenderFormState>((set) => ({
  data: {},
  updateData: (key, value) =>
    set((state) => ({ data: { ...state.data, [key]: value } })),
  resetFrom: () => set({ data: {} }),
}));
