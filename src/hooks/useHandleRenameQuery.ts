import { SuccessResult } from "../models/common";
import { useQueries } from "./useQueries";

export const useHandleRenameQuery = () => {
  // Queries
  const { saveQuery } = useQueries();

  const handleRenameQuery = (
    queryId?: string,
    name?: string
  ): SuccessResult => {
    if (!queryId) {
      alert("Cannot rename non-existent query");
      return { success: false };
    }

    if (!name) {
      alert("Cannot set empty query name");
      return { success: false };
    }

    saveQuery({ id: queryId, data: { name } });

    return { success: true };
  };

  return { handleRenameQuery };
};
