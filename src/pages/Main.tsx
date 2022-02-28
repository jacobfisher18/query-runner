import { Resizable } from "re-resizable";
import styled from "styled-components";
import Editor from "../components/Editor";
import FileManager from "../components/FileManager";
import QueryResults from "../components/QueryResults";
import { SavedQuery } from "../models/query";
import { parseQueryResult } from "../utils/db";
import { Group } from "@mantine/core";
import { useQueryResultStore } from "../store/queryResult";
import ControlBar from "../components/ControlBar";
import SaveModal from "../components/SaveModal";
import Tabs from "../components/Tabs";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { useDocumentSelection } from "../hooks/useDocumentSelection";
import { useModalsStore } from "../store/modals";
import Header from "../components/Header";
import { useTabsStore } from "../store/tabs";
import { isTruthy } from "../utils/nil";
import { useSavedQueriesStore } from "../store/savedQueries";

function Main() {
  // Queries
  const { queryResult, setQueryResult, queryError, setQueryError } =
    useQueryResultStore();
  const { addQuery, updateQuery } = useSavedQueriesStore();

  // Tabs
  const {
    selectedTabId,
    tabs,
    selectTab,
    addTab,
    updateTab,
    removeTab,
    getSelectedTab,
  } = useTabsStore();

  // Modals
  const { setIsSaveModalOpen } = useModalsStore();

  // Document selection
  const documentSelection = useDocumentSelection();

  const handleQuery = async () => {
    const query = documentSelection?.length
      ? documentSelection
      : getSelectedTab()?.data ?? "";

    const [result, err] = await window.electron.queryDatabase(query);
    const parsed = parseQueryResult(result);
    setQueryResult(parsed);
    setQueryError(err ?? null);
  };

  // Hot keys
  const hotKeys: Array<[string, (event: any) => void]> = [
    ["mod+Enter", handleQuery],
    ["mod+S", () => setIsSaveModalOpen(true)],
  ];
  useHotkeys(hotKeys);

  const handleSave = () => {
    const selectedTab = getSelectedTab();
    const queryId = selectedTab?.queryId;
    if (!queryId) {
      // TODO: Don't show this button in this situation
      alert("Not yet handled");
      return;
    }

    const data = getSelectedTab()?.data ?? "";
    if (!data) {
      alert("Cannot save empty query");
      return { success: false };
    }

    // Update saved query data
    updateQuery(queryId, { data });

    // Update tab initial data
    updateTab(selectedTab.id, { initialData: data });
  };

  const handleSaveAs = (name?: string): { success: boolean } => {
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

  const handleSelectQuery = (q: SavedQuery) => {
    // Check if there is already a tab for the given query
    const tabForQuery = Object.values(tabs).find((t) => t?.queryId === q.id);

    // If there's already a tab for the given query, select it
    if (tabForQuery) {
      selectTab(tabForQuery.id);
    } else {
      // Otherwise create a new tab
      addTab({
        queryId: q.id,
        title: q.name,
        data: q.data,
        initialData: q.data,
      });
    }
  };

  return (
    <Container>
      <SaveModal handleSaveAs={handleSaveAs} />
      {/* TODO: Use actual db name */}
      <Header dbName="my_db_0001" />
      <Group style={{ height: "100vh", gap: 0 }}>
        <FileManager selectQuery={handleSelectQuery} />
        <Content>
          <TopSection>
            <Group style={{ width: "100%" }}>
              <ControlBar
                currentQueryName={(() => {
                  const selectedTab = getSelectedTab();
                  return selectedTab
                    ? selectedTab.title ?? "Untitled query"
                    : undefined;
                })()}
                handleQuery={handleQuery}
                handleSave={handleSave}
              />
            </Group>
            <Tabs
              elements={
                Object.values(tabs)
                  .filter(isTruthy)
                  .map((t) => {
                    return {
                      isActive: selectedTabId === t.id,
                      label: t.title ?? "Untitled query",
                      onClose: () => removeTab(t.id),
                      onSelect: () => selectTab(t.id),
                      hasChanges: t.initialData !== t.data,
                    };
                  }) ?? []
              }
              onNewTab={addTab}
            />
            {(() => {
              const selectedTab = getSelectedTab();
              // Only show editor if there's a selected tab
              if (selectedTab) {
                return (
                  <Editor
                    code={selectedTab.data ?? ""}
                    setCode={(data) => updateTab(selectedTab.id, { data })}
                    onKeyDown={getHotkeyHandler(hotKeys)}
                  />
                );
              }
            })()}
          </TopSection>
          <Resizable
            defaultSize={{
              width: "auto",
              height: "auto",
            }}
            enable={{
              top: true,
              right: false,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
            style={{ overflowY: "scroll" }}
            maxHeight={500}
          >
            <Divider />
            <BottomSection>
              {queryResult && typeof queryResult !== "string" && (
                <QueryResults data={queryResult} />
              )}
              {queryResult && typeof queryResult === "string" && (
                <p>{queryResult}</p>
              )}
              <p>{queryError && JSON.stringify(queryError)}</p>
            </BottomSection>
          </Resizable>
        </Content>
      </Group>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  overflow: auto;
  height: 100%;
`;

const TopSection = styled.div`
  overflow-y: scroll;
`;

const BottomSection = styled.div`
  width: 100%;
  overflow-y: scroll;
`;

const Divider = styled.div`
  width: 100%;
  height: 3px;
  background-color: #ccc;
`;

export default Main;
