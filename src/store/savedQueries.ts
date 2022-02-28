import _ from "lodash";
import create from "zustand";
import { SavedQuery } from "../models/query";

interface SavedQueriesState {
  queries: Record<string, SavedQuery | undefined>;
  addQuery: (data: Omit<SavedQuery, "id">) => SavedQuery;
  updateQuery: (id: string, data: Partial<SavedQuery>) => void;
}

export const useSavedQueriesStore = create<SavedQueriesState>((set) => ({
  // initial state
  queries: {},
  // methods for manipulating state
  addQuery: (data: Omit<SavedQuery, "id">): SavedQuery => {
    const query = {
      id: _.uniqueId(),
      ...data,
    };
    set((state) => ({
      ...state,
      queries: {
        ...state.queries,
        [query.id]: query,
      },
    }));
    return query;
  },
  updateQuery: (id: string, data: Partial<SavedQuery>) => {
    set((state) => {
      const existingQuery = state.queries[id];
      if (!existingQuery) {
        console.error("Tried to update non-existent query");
        return state;
      }

      return {
        ...state,
        queries: {
          ...state.queries,
          [id]: {
            ...existingQuery,
            ...data,
          },
        },
      };
    });
  },
}));
