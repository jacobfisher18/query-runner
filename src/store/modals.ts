import create from "zustand";
import { ConfirmModalProps } from "../components/ConfirmModal";

interface ModalsState {
  isSaveQueryModalOpen: boolean;
  setIsSaveQueryModalOpen: (val: boolean) => void;
  editQueryModalOpenForQueryId: string | null;
  setEditQueryModalOpenForQueryId: (id: string | null) => void;
  isConnectionsModalOpen: boolean;
  setIsConnectionsModalOpen: (val: boolean) => void;
  confirmModalProps: ConfirmModalProps | null;
  setConfirmModalProps: (p: ConfirmModalProps | null) => void;
}

export const useModalsStore = create<ModalsState>((set) => ({
  // initial state
  isSaveQueryModalOpen: false,
  editQueryModalOpenForQueryId: null,
  isConnectionsModalOpen: false,
  confirmModalProps: null,
  // methods for manipulating state
  setIsSaveQueryModalOpen: (val: boolean) => {
    set((state) => ({
      ...state,
      isSaveQueryModalOpen: val,
    }));
  },
  setEditQueryModalOpenForQueryId: (id: string | null) => {
    set((state) => ({
      ...state,
      editQueryModalOpenForQueryId: id,
    }));
  },
  setIsConnectionsModalOpen: (val: boolean) => {
    set((state) => ({
      ...state,
      isConnectionsModalOpen: val,
    }));
  },
  setConfirmModalProps: (p: ConfirmModalProps | null) => {
    set((state) => ({
      ...state,
      confirmModalProps: p,
    }));
  },
}));
