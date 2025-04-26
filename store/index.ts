import { create } from "zustand";

interface NavigationStore {
  handleNext: (() => void) | null;
  setHandleNext: (fn: (() => void) | null) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  handleNext: null,
  setHandleNext: (fn) => set({ handleNext: fn }),
}));
``;

interface LocationInfo {
  longitude?: number;
  latitude?: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface ReceiverInfo {
  name?: string;
  phone?: string;
  email?: string;
  alternativePhone?: string;
}

interface SenderFormData {
  pickupLocation?: LocationInfo;
  deliveryLocation?: LocationInfo;
  packageWeight?: string;
  packageSize?: string;
  packageType?: string;
  packageContent?: string;
  packageDescription?: string;
  receiverInfo?: ReceiverInfo;
}

interface SenderFormState {
  data: SenderFormData;
  updatePickupLocation: (location: Partial<LocationInfo>) => void;
  updateDeliveryLocation: (location: Partial<LocationInfo>) => void;
  updateReceiverInfo: (info: Partial<ReceiverInfo>) => void;
  updateField: <K extends keyof SenderFormData>(
    key: K,
    value: SenderFormData[K]
  ) => void;
  resetForm: () => void;
}

export const useFormStore = create<SenderFormState>((set) => ({
  data: {},

  updatePickupLocation: (location) =>
    set((state) => ({
      data: {
        ...state.data,
        pickupLocation: {
          ...(state.data.pickupLocation ?? {}),
          ...location,
        },
      },
    })),

  updateDeliveryLocation: (location) =>
    set((state) => ({
      data: {
        ...state.data,
        deliveryLocation: {
          ...(state.data.deliveryLocation ?? {}),
          ...location,
        },
      },
    })),

  updateReceiverInfo: (receiver) =>
    set((state) => ({
      data: {
        ...state.data,
        receiverInfo: {
          ...(state.data.receiverInfo ?? {}),
          ...receiver,
        },
      },
    })),

  updateField: (key, value) =>
    set((state) => ({
      data: {
        ...state.data,
        [key]: value,
      },
    })),

  resetForm: () => set({ data: {} }),
}));
