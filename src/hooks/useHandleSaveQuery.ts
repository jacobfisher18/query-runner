import { useQueriesStore } from "../store/queries";
import { useTabsStore } from "../store/tabs";

export const useHandleSaveQuery = () => {
  // Queries
  const { updateQuery } = useQueriesStore();

  // Tabs
  const { getSelectedTab, updateTab } = useTabsStore();

  const handleSaveQuery = () => {
    const selectedTab = getSelectedTab();
    const queryId = selectedTab?.queryId;
    if (!queryId) {
      // Can't save if there's no existing query to save
      return;
    }

    const data = selectedTab?.data ?? "";
    if (!data) {
      alert("Cannot save empty query");
    }

    // Update query data
    updateQuery(queryId, { data });

    // Update tab initial data
    updateTab(selectedTab.id, { initialData: data });
  };

  return { handleSaveQuery };
};
