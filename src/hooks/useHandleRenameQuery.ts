import { SuccessResult } from "../models/common";
import { useQueriesStore } from "../store/queries";
import { useTabsStore } from "../store/tabs";

export const useHandleRenameQuery = () => {
  // Queries
  const { updateQuery } = useQueriesStore();

  // Tabs
  const { tabs, updateTab } = useTabsStore();

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

    updateQuery(queryId, { name });

    const tabForQuery = Object.values(tabs).find((t) => t?.queryId === queryId);
    if (tabForQuery) {
      updateTab(tabForQuery.id, { title: name });
    }

    return { success: true };
  };

  return { handleRenameQuery };
};
