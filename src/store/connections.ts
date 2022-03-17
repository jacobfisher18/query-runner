import _ from "lodash";
import create from "zustand";

interface ConnectionsState {
  selectedConnectionId: string | null;
  selectConnection: (id: string) => void;

  connectedConnectionIds: Array<string>;
  addConnectedConnection: (id: string) => void;
  removeConnectedConnection: (id: string) => void;
}

export const useConnectionsStore = create<ConnectionsState>((set) => ({
  // initial state
  selectedConnectionId: null,
  connectedConnectionIds: [],
  // methods for manipulating state
  selectConnection: (id: string) => {
    set((state) => ({
      ...state,
      selectedConnectionId: id,
    }));
  },
  addConnectedConnection: (id: string) => {
    set((state) => ({
      ...state,
      connectedConnectionIds: _.uniq([...state.connectedConnectionIds, id]),
    }));
  },
  removeConnectedConnection: (id: string) => {
    set((state) => ({
      ...state,
      connectedConnectionIds: state.connectedConnectionIds.filter(
        (c) => c !== id
      ),
    }));
  },
}));
