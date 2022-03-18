import { SuccessResult } from "../models/common";
import { useTabsStore } from "../store/tabs";
import { useFileStructure } from "./useFileStructure";
import { useQueries } from "./useQueries";

export const useHandleSaveQueryAs = () => {
  // Queries
  const { createQuery } = useQueries();

  // Tabs
  const { getSelectedTab, updateTab, addTab } = useTabsStore();

  // File structure
  const { addFile } = useFileStructure();

  const handleSaveQueryAs = async (
    name?: string,
    folderId?: string
  ): Promise<SuccessResult> => {
    if (!name) {
      alert("Cannot save query without name");
      return { success: false };
    }

    const data = getSelectedTab()?.data ?? "";
    if (!data) {
      alert("Cannot save empty query");
      return { success: false };
    }

    const [, newQuery] = await createQuery({ data, name });

    /**
     * TODO: Think through how to handle when this fails or when the app
     * crashes before this. Data gets into a bad state where we have a query
     * that is not part of the file structure. Needs some sort of transaction.
     */
    // Add the query to the file structure
    addFile({ queryId: newQuery.id, folderId });

    // If current tab is an untitled query and it was just saved, update the state of the current tab
    const selectedTab = getSelectedTab();
    if (selectedTab && !selectedTab.queryId) {
      updateTab(selectedTab.id, {
        queryId: newQuery.id,
      });
    } else {
      // Otherwise add a new tab for the new query
      addTab({
        queryId: newQuery.id,
        data: newQuery.data,
      });
    }

    return { success: true };
  };

  return { handleSaveQueryAs };
};
