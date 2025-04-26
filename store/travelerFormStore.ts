import { create } from "zustand";

interface Location {
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
}

interface TravelerFormData {
  startLocation: Location;
  destinationLocation: Location;
  selectedPackageId: string | null;
  price: number;
  travelMedium: "car" | "bike" | "foot" | "public_transport";
  trackingNumber: string | null;
  travelStatus: "pending" | "in_progress" | "completed";
}

interface TravelerFormStore {
  data: TravelerFormData;
  updateStartLocation: (location: Location) => void;
  updateDestinationLocation: (location: Location) => void;
  setTravelMedium: (
    medium: "car" | "bike" | "foot" | "public_transport"
  ) => void;
  selectPackage: (packageId: string, price: number) => void;
  setTrackingNumber: (trackingNumber: string) => void;
  setTravelStatus: (status: "pending" | "in_progress" | "completed") => void;
  resetForm: () => void;
}

const initialLocation = {
  address: "",
  latitude: 0,
  longitude: 0,
  city: "",
  state: "",
};

export const useTravelerFormStore = create<TravelerFormStore>((set) => ({
  data: {
    startLocation: initialLocation,
    destinationLocation: initialLocation,
    selectedPackageId: null,
    price: 0,
    travelMedium: "car", // Default travel medium
    trackingNumber: null,
    travelStatus: "pending",
  },

  updateStartLocation: (location) =>
    set((state) => ({
      data: {
        ...state.data,
        startLocation: location,
      },
    })),

  updateDestinationLocation: (location) =>
    set((state) => ({
      data: {
        ...state.data,
        destinationLocation: location,
      },
    })),

  selectPackage: (packageId, price) =>
    set((state) => ({
      data: {
        ...state.data,
        selectedPackageId: packageId,
        price,
      },
    })),

  setTrackingNumber: (trackingNumber) =>
    set((state) => ({
      data: {
        ...state.data,
        trackingNumber,
      },
    })),

  setTravelStatus: (status) =>
    set((state) => ({
      data: {
        ...state.data,
        travelStatus: status,
      },
    })),

  setTravelMedium: (medium) =>
    set((state) => ({
      data: {
        ...state.data,
        travelMedium: medium,
      },
    })),

  resetForm: () =>
    set(() => ({
      data: {
        startLocation: initialLocation,
        destinationLocation: initialLocation,
        selectedPackageId: null,
        price: 0,
        trackingNumber: null,
        travelStatus: "pending",
      },
    })),
}));
