import { create } from 'zustand';
import { KYCInfo } from '@/models/kycModel';

interface KYCFormState {
  currentStep: number;
  formData: {
    govId?: KYCInfo['govId'];
    documentImages: {
      front: string;
      back: string;
    };
    selfieImage?: string;
  };
  setFormData: (data: Partial<KYCFormState['formData']>) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;
}

export const useKYCFormStore = create<KYCFormState>((set) => ({
  currentStep: 1,
  formData: {
    documentImages: {
      front: '',
      back: ''
    }
  },
  setFormData: (data) => set((state) => ({
    formData: {
      ...state.formData,
      ...data,
      documentImages: {
        ...state.formData.documentImages,
        ...data.documentImages
      }
    }
  })),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
  resetForm: () => set({
    currentStep: 1,
    formData: {
      documentImages: {
        front: '',
        back: ''
      }
    }
  })
}));
