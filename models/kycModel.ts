export interface KYCInfo {
  userId: string;
  govId: {
    number: string;
    type: 'passport' | 'driving_license' | 'aadhaar_card';
  };
  documentImages: {
    front: string; // URL to the image
    back: string;  // URL to the image
  };
  selfieImage: string; // URL to the selfie image
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  verifiedBy?: string; // Admin ID who verified
  verificationDate?: Date;
  rejectionReason?: string;
}
