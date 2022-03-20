import { useTabsStore } from "../store/tabs";
import { useQueries } from "../hooks/useQueries";
import { Query } from "../models/query";

export const useSelectedQuery = (): Query | undefined => {
  const { queries } = useQueries();
  const { getSelectedTab } = useTabsStore();
  const selectedTab = getSelectedTab();
  const selectedQuery = selectedTab?.queryId
    ? queries[selectedTab.queryId]
    : undefined;

  return selectedQuery;
};
