import create from "zustand";
import { QueryResult } from "../utils/db";

interface QueryResultState {
  queryResult: QueryResult | string | null;
  setQueryResult: (r: QueryResult | string | null) => void;
  queryError: string | null;
  setQueryError: (qe: string | null) => void;
}

export const useQueryResultStore = create<QueryResultState>((set) => ({
  // initial state
  queryResult: null,
  queryError: null,
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
}));
