import { Query } from "../models/query";
import { useTabsStore } from "../store/tabs";

export const useHandleSelectQuery = () => {
  // Tabs
  const { tabs, selectTab, addTab } = useTabsStore();

  const handleSelectQuery = (q: Query) => {
    // Check if there is already a tab for the given query
    const tabForQuery = Object.values(tabs).find((t) => t?.queryId === q.id);

    // If there's already a tab for the given query, select it
    if (tabForQuery) {
      selectTab(tabForQuery.id);
    } else {
      // Otherwise create a new tab
      addTab({
        queryId: q.id,
        data: q.data,
      });
    }
  };

  return { handleSelectQuery };
};
