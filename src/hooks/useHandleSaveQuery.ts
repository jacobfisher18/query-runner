import { SuccessResult } from "../models/common";
import { useTabsStore } from "../store/tabs";
import { useQueries } from "./useQueries";

export const useHandleSaveQuery = () => {
  // Queries
  const { saveQuery } = useQueries();

  // Tabs
  const { getSelectedTab } = useTabsStore();

  const handleSaveQuery = (): SuccessResult => {
    const selectedTab = getSelectedTab();
    const queryId = selectedTab?.queryId;
    if (!queryId) {
      // Can't save if there's no existing query to save
      return { success: false };
    }

    const data = selectedTab?.data ?? "";
    if (!data) {
      alert("Cannot save empty query");
    }

    // Update query data
    saveQuery({ id: queryId, data: { data } });

    return { success: true };
  };

  return { handleSaveQuery };
};
