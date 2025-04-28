export interface TravelModel {
  travelId: string; // Firestore doc ID
  travelerId: string; // user.uid
  packageId: string;

  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  startLocation: {
    address: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    zipCode?: string;
  };

  destinationLocation: {
    address: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    zipCode?: string;
  };
  trackingNumber: string;
  locationUpdates: {
    latitude: number;
    longitude: number;
    timestamp: string; // ISO string
  }[];

  isTrackingActive: boolean;

  travelStatus: "pending" | "in-progress" | "completed" | "cancelled";

  price: number;

  startedAt?: string; // ISO timestamp
  completedAt?: string;

  notes?: string;
}
