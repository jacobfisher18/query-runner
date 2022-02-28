import { Button, Group, Menu, Text } from "@mantine/core";
import { useDocumentSelection } from "../hooks/useDocumentSelection";
import { useModalsStore } from "../store/modals";
import { useState } from "react";
import { useTabsStore } from "../store/tabs";
import { useSavedQueriesStore } from "../store/savedQueries";

function ControlBar({
  handleQuery,
  handleSave,
  enableSave = true,
  enableSaveAs = true,
}: {
  handleQuery: () => Promise<void>;
  handleSave: () => void;
  enableSave?: boolean;
  enableSaveAs?: boolean;
}) {
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const { setIsSaveModalOpen, setRenameModalOpenForQueryId } = useModalsStore();

  const { getSelectedTab } = useTabsStore();
  const { queries } = useSavedQueriesStore();

  const selectedTab = getSelectedTab();
  const title = selectedTab
    ? selectedTab?.title ?? "Untitled query"
    : undefined;
  const selectedQuery = selectedTab?.queryId
    ? queries[selectedTab.queryId]
    : undefined;

  const documentSelection = useDocumentSelection();

  return (
    <Group
      style={{
        width: "100%",
        padding: "15px 30px",
        borderBottom: "1px solid #eeeeee",
      }}
      position="apart"
    >
      <Group>
        {title && (
          <>
            <Text>{title}</Text>
            {selectedQuery && (
              <Menu
                opened={isMenuOpened}
                onOpen={() => setIsMenuOpened(true)}
                onClose={() => setIsMenuOpened(false)}
              >
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
          <Button variant="outline" size="xs" onClick={handleSave}>
            Save
          </Button>
        )}
        {enableSaveAs && (
          <Button
            variant="outline"
            size="xs"
            onClick={() => setIsSaveModalOpen(true)}
          >
            Save As
          </Button>
        )}
        <Button
          variant="filled"
          size="xs"
          onClick={async () => {
            await handleQuery();
          }}
        >
          {documentSelection ? "Submit Selection" : "Submit"}
        </Button>
      </Group>
    </Group>
  );
}

export default ControlBar;
