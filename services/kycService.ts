import { db, storage } from '@/firebaseConfig';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { KYCInfo } from '@/models/kycModel';
import * as FileSystem from 'expo-file-system';

export const kycService = {
  async submitKYC(userId: string, kycData: Omit<KYCInfo, 'userId' | 'createdAt' | 'updatedAt' | 'status'>): Promise<void> {
    const kycRef = doc(db, 'kyc', userId);
    const kycInfo: KYCInfo = {
      ...kycData,
      userId,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await setDoc(kycRef, kycInfo);
  },

  async getKYCStatus(userId: string): Promise<KYCInfo | null> {
    const kycRef = doc(db, 'kyc', userId);
    const kycSnap = await getDoc(kycRef);
    return kycSnap.exists() ? kycSnap.data() as KYCInfo : null;
  },

  async uploadImage(userId: string, imageUri: string, type: 'front' | 'back' | 'selfie'): Promise<string> {
    let uri = imageUri;
    // If the URI is a content URI, copy it to a file URI
    if (uri.startsWith('content://')) {
      const fileUri = FileSystem.cacheDirectory + `${type}_${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: uri, to: fileUri });
      uri = fileUri;
    }
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageRef = ref(storage, `kyc/${userId}/${type}_${Date.now()}`);
    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
  },

  async updateKYCStatus(userId: string, status: 'approved' | 'rejected', adminId: string, rejectionReason?: string): Promise<void> {
    const kycRef = doc(db, 'kyc', userId);
    await updateDoc(kycRef, {
      status,
      verifiedBy: adminId,
      verificationDate: new Date(),
      rejectionReason: status === 'rejected' ? rejectionReason : null,
      updatedAt: new Date()
    });
  }
};
