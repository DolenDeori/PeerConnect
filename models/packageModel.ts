export interface PackageModel {
  travelId: string | number | (string | number)[] | null | undefined;
  id: string;
  senderId: string;
  travelerId?: string;
  trackingNumber: string;
  packageInfo: {
    type: string;
    weight: string;
    size: string;
    content: string;
    description?: string;
    pickupLocation: {
      address: string;
      latitude: number;
      longitude: number;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    deliveryLocation: {
      address: string;
      latitude: number;
      longitude: number;
      city?: string;
      state?: string;
      zipCode?: string;
    };
  };
  receiverInfo: {
    name: string;
    phoneNumber: string;
    email?: string;
    alternativePhoneNumber?: string;
  };
  packageDeliveryInfo?: {
    pickupDate?: string;
    pickupTime?: string;
    deliveryDate?: string;
    deliveryTime?: string;
  };
  price: number;
  status: string | "pending" | "in transit" | "delivered"; // e.g., "pending", "in transit", "delivered"
  createdAt: string; // ISO date string
  updatedAt?: string;
  deliveryFee?: number;
}
