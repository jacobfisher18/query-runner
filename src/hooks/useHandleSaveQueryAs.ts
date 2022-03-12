import { SuccessResult } from "../models/common";
import { useQueriesStore } from "../store/queries";
import { useTabsStore } from "../store/tabs";

export const useHandleSaveQueryAs = () => {
  // Queries
  const { addQuery } = useQueriesStore();

  // Tabs
  const { getSelectedTab, updateTab, addTab } = useTabsStore();

  const handleSaveQueryAs = (name?: string): SuccessResult => {
    if (!name) {
      alert("Cannot save query without name");
      return { success: false };
    }

    const data = getSelectedTab()?.data ?? "";
    if (!data) {
      alert("Cannot save empty query");
      return { success: false };
    }

    const newQuery = addQuery({ data, name });

    // If current tab is an untitled query and it was just saved, update the state of the current tab
    const selectedTab = getSelectedTab();
    if (selectedTab && !selectedTab.queryId) {
      updateTab(selectedTab.id, {
        queryId: newQuery.id,
        title: name,
        initialData: newQuery.data,
      });
    } else {
      // Otherwise add a new tab for the new query and go there
      addTab({
        queryId: newQuery.id,
        title: newQuery.name,
        data: newQuery.data,
        initialData: newQuery.data,
      });
    }

    return { success: true };
  };

  return { handleSaveQueryAs };
};
