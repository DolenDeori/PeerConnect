export interface PackageModel {
  id: string;
  senderId: string;
  trackingNumber: string;
  packageInfo: {
    type: string;
    weight: string;
    size: string;
    content: string;
    description?: string;
    pickupLocation: string;
    dropoffLocation: string;
  };
  receiverInfo: {
    name: string;
    phoneNumber: string;
    email?: string;
    alternativePhoneNumber?: string;
  };
  packageDeliveryInfo?: {
    travelerId?: string;
    pickupDate?: string;
    pickupTime?: string;
    deliveryDate?: string;
    deliveryTime?: string;
  };
  status: string | "pending" | "in transit" | "delivered"; // e.g., "pending", "in transit", "delivered"
}
