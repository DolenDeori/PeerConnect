export interface KYCInfo {
  userId: string;
  govId: {
    number: string;
    type: "passport" | "driving_license" | "aadhaar_card";
  };
  documentImages: {
    front: string;
    back: string;
  };
  selfieImage: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  verifiedBy?: string;
  verificationDate?: Date;
  rejectionReason?: string;
}
