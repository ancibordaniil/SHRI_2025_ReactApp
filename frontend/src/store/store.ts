import { create } from 'zustand';

type Status = 'initial' | 'loading' | 'done' | 'error';

interface GenerateState {
  status: Status;
  setStatus: (status: Status) => void;
}

export const useGenerateStore = create<GenerateState>((set) => ({
  status: 'initial',
  setStatus: (status) => set({ status }),
}));