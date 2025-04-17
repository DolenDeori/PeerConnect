export interface PackageModel {
  id: string;
  senderId: string;
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
    alternativePhoneNumber?: string;
    email?: string;
  };
  status: string | "pending" | "in transit" | "delivered"; // e.g., "pending", "in transit", "delivered"
}
