import styled from "styled-components";
import Editor from "../components/Editor";
import FileManager from "../components/FileManager";
import QueryResults from "../components/QueryResults";
import { Group, Text } from "@mantine/core";
import { useQueryResultStore } from "../store/queryResult";
import ControlBar from "../components/ControlBar";
import SaveQueryModal from "../components/SaveQueryModal";
import Tabs from "../components/Tabs";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { useModalsStore } from "../store/modals";
import Header from "../components/Header";
import { useTabsStore } from "../store/tabs";
import EditQueryModal from "../components/EditQueryModal";
import { useHandleSubmitQuery } from "../hooks/useHandleSubmitQuery";
import { useHandleSaveQuery } from "../hooks/useHandleSaveQuery";
import ResizeableSection from "../components/ResizeableSection";
import { getTheme } from "../hooks/useTheme";

function Main() {
  // Queries
  const { queryResult, queryError } = useQueryResultStore();

  // Tabs
  const { addTab, updateTab, getSelectedTab } = useTabsStore();
  const selectedTab = getSelectedTab();

  // Modals
  const { setIsSaveQueryModalOpen } = useModalsStore();

  // Actions
  const { handleSubmitQuery } = useHandleSubmitQuery();
  const { handleSaveQuery } = useHandleSaveQuery();

  // Hot keys
  const hotKeys: Array<[string, (event: any) => void]> = [
    ["mod+Enter", handleSubmitQuery],
    ["mod+S", handleSaveQuery],
    ["mod+shift+S", () => setIsSaveQueryModalOpen(true)],
    ["mod+T", addTab],
  ];
  useHotkeys(hotKeys);

  return (
    <Container>
      <SaveQueryModal />
      <EditQueryModal />
      <Header />
      <Body>
        <FileManager />
        <Content>
          <TopSection>
            <Tabs />
            <Group style={{ width: "100%" }}>
              <ControlBar />
            </Group>
            {selectedTab && (
              <Editor
                code={selectedTab.data ?? ""}
                setCode={(data) => updateTab(selectedTab.id, { data })}
                onKeyDown={getHotkeyHandler(hotKeys)}
              />
            )}
          </TopSection>
          <ResizeableSection>
            <BottomSection>
              {queryResult && typeof queryResult !== "string" && (
                <QueryResults data={queryResult} />
              )}
              {queryResult && typeof queryResult === "string" && (
                <Text>{queryResult}</Text>
              )}
              <Text>{queryError && queryError}</Text>
            </BottomSection>
          </ResizeableSection>
        </Content>
      </Body>
    </Container>
  );
}

const Body = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${(p) => getTheme(p).color.background};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  overflow: auto;
  height: 100%;
`;

const TopSection = styled.div``;

const BottomSection = styled.div`
  width: 100%;
  overflow-y: scroll;
`;

export default Main;
