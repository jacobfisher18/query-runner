import { useTabsStore } from "../store/tabs";
import { useFileStructure } from "./useFileStructure";
import { useQueries } from "./useQueries";

export const useHandleDeleteQuery = () => {
  // Tabs
  const { tabs, removeTab } = useTabsStore();

  // Queries
  const { deleteQuery } = useQueries();

  // File structure
  const { deleteFile } = useFileStructure();

  const handleDeleteQuery = (queryId: string) => {
    // Check if there is a tab for the query
    const tabForQuery = Object.values(tabs).find((t) => t?.queryId === queryId);

    // If there is a tab for the query, delete it
    if (tabForQuery) {
      removeTab(tabForQuery.id);
    }

    // Delete the query from the file structure
    deleteFile({ queryId });

    // Finally, delete the query
    deleteQuery(queryId);
  };

  return { handleDeleteQuery };
};
