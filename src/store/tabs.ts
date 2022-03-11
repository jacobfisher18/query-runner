import create from "zustand";
import * as uuid from "uuid";

export interface Tab {
  id: string;
  title?: string;
  queryId?: string;
  data: string;
  initialData?: string;
}

interface TabsState {
  selectedTabId: string | null;
  tabs: Record<string, Tab | undefined>;
  selectTab: (id: string) => void;
  addTab: (data?: Partial<Omit<Tab, "id">>, shouldSelect?: boolean) => Tab;
  updateTab: (id: string, data: Partial<Tab>) => void;
  removeTab: (id: string) => void;
  getSelectedTab: () => Tab | null;
}

export const useTabsStore = create<TabsState>((set, get) => ({
  // initial state
  selectedTabId: null,
  tabs: {},
  // methods for manipulating state
  selectTab: (id: string) => {
    set((state) => ({
      ...state,
      selectedTabId: id,
    }));
  },
  addTab: (data: Partial<Tab> = {}, shouldSelect: boolean = true): Tab => {
    const tab = {
      id: uuid.v4(),
      data: "",
      ...data,
    };
    set((state) => ({
      ...state,
      tabs: {
        ...state.tabs,
        [tab.id]: tab,
      },
      // Optionally select the new tab
      selectedTabId: shouldSelect ? tab.id : state.selectedTabId,
    }));
    return tab;
  },
  updateTab: (id: string, data: Partial<Tab>) => {
    set((state) => {
      const existingTab = state.tabs[id];
      if (!existingTab) {
        console.error("Tried to update non-existent tab");
        return state;
      }

      return {
        ...state,
        tabs: {
          ...state.tabs,
          [id]: {
            ...existingTab,
            ...data,
          },
        },
      };
    });
  },
  removeTab: (id: string) => {
    set((state) => {
      const newState = { ...state };

      // Unselect the tab we're deleting if it's selected
      if (newState.selectedTabId === id) {
        newState.selectedTabId = null;
      }

      // Delete the tab
      if (newState.tabs[id]) {
        delete newState.tabs[id];
      }

      return newState;
    });
  },
  getSelectedTab: () => {
    const { tabs, selectedTabId } = get();
    return selectedTabId ? tabs[selectedTabId] ?? null : null;
  },
}));
