import create from "zustand";

interface ModalsState {
  isSaveModalOpen: boolean;
  setIsSaveModalOpen: (val: boolean) => void;
  renameModalOpenForQueryId: string | null;
  setRenameModalOpenForQueryId: (id: string | null) => void;
}

export const useModalsStore = create<ModalsState>((set) => ({
  // initial state
  isSaveModalOpen: false,
  renameModalOpenForQueryId: null,
  // methods for manipulating state
  setIsSaveModalOpen: (val: boolean) => {
    set((state) => ({
      ...state,
      isSaveModalOpen: val,
    }));
  },
  setRenameModalOpenForQueryId: (id: string | null) => {
    set((state) => ({
      ...state,
      renameModalOpenForQueryId: id,
    }));
  },
}));
