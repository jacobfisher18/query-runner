import create from "zustand";

interface ModalsState {
  isSaveModalOpen: boolean;
  setIsSaveModalOpen: (val: boolean) => void;
}

export const useModalsStore = create<ModalsState>((set) => ({
  // initial state
  isSaveModalOpen: false,
  // methods for manipulating state
  setIsSaveModalOpen: (val: boolean) => {
    set((state) => ({
      ...state,
      isSaveModalOpen: val,
    }));
  },
}));
