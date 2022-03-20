import create from "zustand";

export interface QueryResult {
  fields: Array<{ name: string }>;
  rows: Array<Record<string, unknown>>;
}

interface QueryResultState {
  queryResult: QueryResult | string | null;
  setQueryResult: (r: QueryResult | string | null) => void;
  queryError: string | null;
  setQueryError: (qe: string | null) => void;
  isQueryLoading: boolean;
  setIsQueryLoading: (val: boolean) => void;
}

export const useQueryResultStore = create<QueryResultState>((set) => ({
  // initial state
  queryResult: null,
  queryError: null,
  isQueryLoading: false,
  // methods for manipulating state
  setQueryResult: (r: QueryResult | string | null) => {
    set((state) => ({
      ...state,
      queryResult: r,
    }));
  },
  setQueryError: (e: string | null) => {
    set((state) => ({
      ...state,
      queryError: e,
    }));
  },
  setIsQueryLoading: (val: boolean) => {
    set((state) => ({
      ...state,
      isQueryLoading: val,
    }));
  },
}));
