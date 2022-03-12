import { Button, Group, Menu, Text } from "@mantine/core";
import { useDocumentSelection } from "../hooks/useDocumentSelection";
import { useModalsStore } from "../store/modals";
import { useTabsStore } from "../store/tabs";
import { useQueriesStore } from "../store/queries";
import { useTheme } from "../hooks/useTheme";
import { useHandleSubmitQuery } from "../hooks/useHandleSubmitQuery";
import { useHandleSaveQuery } from "../hooks/useHandleSaveQuery";

function ControlBar() {
  const theme = useTheme();

  // Modals
  const { setIsSaveQueryModalOpen, setRenameModalOpenForQueryId } =
    useModalsStore();

  // Queries
  const { queries } = useQueriesStore();

  // Tabs
  const { getSelectedTab } = useTabsStore();

  // Actions
  const { handleSubmitQuery } = useHandleSubmitQuery();
  const { handleSaveQuery } = useHandleSaveQuery();

  const selectedTab = getSelectedTab();
  const title = selectedTab
    ? selectedTab?.title ?? "Untitled query"
    : undefined;
  const selectedQuery = selectedTab?.queryId
    ? queries[selectedTab.queryId]
    : undefined;

  const documentSelection = useDocumentSelection();

  const enableSave = Boolean(selectedTab?.queryId);
  const enableSaveAs = true;

  return (
    <Group
      style={{
        width: "100%",
        padding: "15px 30px",
        borderBottom: `1px solid ${theme.color.highlight}`,
      }}
      position="apart"
    >
      <Group>
        {title && (
          <>
            <Text color={theme.color.foreground}>{title}</Text>
            {selectedQuery && (
              <Menu>
                <Menu.Label>Actions</Menu.Label>
                <Menu.Item
                  onClick={() => setRenameModalOpenForQueryId(selectedQuery.id)}
                >
                  Rename query
                </Menu.Item>
              </Menu>
            )}
          </>
        )}
      </Group>
      <Group position="right" spacing="xs">
        {enableSave && (
          <Button variant="outline" size="xs" onClick={handleSaveQuery}>
            Save
          </Button>
        )}
        {enableSaveAs && (
          <Button
            variant="outline"
            size="xs"
            onClick={() => setIsSaveQueryModalOpen(true)}
          >
            Save As
          </Button>
        )}
        <Button
          variant="filled"
          size="xs"
          onClick={async () => {
            await handleSubmitQuery();
          }}
        >
          {documentSelection ? "Submit Selection" : "Submit"}
        </Button>
      </Group>
    </Group>
  );
}

export default ControlBar;
