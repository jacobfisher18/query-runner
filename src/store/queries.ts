import _ from "lodash";
import create from "zustand";

export interface Query {
  id: string;
  data: string;
  name: string;
}

interface QueriesState {
  queries: Record<string, Query | undefined>;
  addQuery: (data: Omit<Query, "id">) => Query;
  updateQuery: (id: string, data: Partial<Query>) => void;
}

export const useQueriesStore = create<QueriesState>((set) => ({
  // initial state
  queries: {},
  // methods for manipulating state
  addQuery: (data: Omit<Query, "id">): Query => {
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
  updateQuery: (id: string, data: Partial<Query>) => {
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
