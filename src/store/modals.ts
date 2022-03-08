import create from "zustand";

interface ModalsState {
  isSaveQueryModalOpen: boolean;
  setIsSaveQueryModalOpen: (val: boolean) => void;
  renameModalOpenForQueryId: string | null;
  setRenameModalOpenForQueryId: (id: string | null) => void;
  isConnectionsModalOpen: boolean;
  setIsConnectionsModalOpen: (val: boolean) => void;
}

export const useModalsStore = create<ModalsState>((set) => ({
  // initial state
  isSaveQueryModalOpen: false,
  renameModalOpenForQueryId: null,
  isConnectionsModalOpen: false,
  // methods for manipulating state
  setIsSaveQueryModalOpen: (val: boolean) => {
    set((state) => ({
      ...state,
      isSaveQueryModalOpen: val,
    }));
  },
  setRenameModalOpenForQueryId: (id: string | null) => {
    set((state) => ({
      ...state,
      renameModalOpenForQueryId: id,
    }));
  },
  setIsConnectionsModalOpen: (val: boolean) => {
    set((state) => ({
      ...state,
      isConnectionsModalOpen: val,
    }));
  },
}));
