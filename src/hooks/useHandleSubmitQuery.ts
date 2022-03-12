import { useConnectionsStore } from "../store/connections";
import { useQueryResultStore } from "../store/queryResult";
import { useTabsStore } from "../store/tabs";
import { parseQueryResult } from "../utils/db";
import { useDocumentSelection } from "./useDocumentSelection";

export const useHandleSubmitQuery = () => {
  // Queries
  const { setQueryResult, setQueryError } = useQueryResultStore();

  // Tabs
  const { getSelectedTab } = useTabsStore();

  // Connections
  const { selectedConnectionId } = useConnectionsStore();

  // Document selection
  const documentSelection = useDocumentSelection();

  const handleSubmitQuery = async () => {
    setQueryResult(null);
    setQueryError(null);

    const query = documentSelection?.length
      ? documentSelection
      : getSelectedTab()?.data ?? "";

    try {
      if (!selectedConnectionId) {
        alert("Cannot query without selecting a connection");
        return;
      }
      const result = await window.electron.queryClient(
        selectedConnectionId,
        query
      );
      const parsed = parseQueryResult(result);
      setQueryResult(parsed);
    } catch (err) {
      setQueryError((err as Error).message ?? null);
    }
  };

  return { handleSubmitQuery };
};
