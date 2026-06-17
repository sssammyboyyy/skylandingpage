import { create } from 'zustand';

export interface UIStoreState {
  roiCalculator: {
    avgCustomerValue: number;
    monthlyTraffic: number;
    conversionRate: number;
  };
  setROICalculator: (key: keyof UIStoreState['roiCalculator'], value: number) => void;
  // future state hooks
}

export const useUIStore = create<UIStoreState>((set) => ({
  roiCalculator: {
    avgCustomerValue: 1500,
    monthlyTraffic: 500,
    conversionRate: 0.02,
  },
  setROICalculator: (key, value) =>
    set((state) => ({
      roiCalculator: {
        ...state.roiCalculator,
        [key]: value,
      },
    })),
}));
