import { Button, Group, Menu, Text } from "@mantine/core";
import { useDocumentSelection } from "../hooks/useDocumentSelection";
import { useModalsStore } from "../store/modals";
import { useTabsStore } from "../store/tabs";
import { useTheme } from "../hooks/useTheme";
import { useHandleSubmitQuery } from "../hooks/useHandleSubmitQuery";
import { useHandleSaveQuery } from "../hooks/useHandleSaveQuery";
import { useQueries } from "../hooks/useQueries";
import ConfirmModal from "./ConfirmModal";
import { useState } from "react";
import { useHandleDeleteQuery } from "../hooks/useHandleDeleteQuery";

function ControlBar() {
  const theme = useTheme();

  // Local state
  const [isDeleteQueryModalOpen, setIsDeleteQueryModalOpen] =
    useState<boolean>(false);

  // Modals
  const { setIsSaveQueryModalOpen, setRenameModalOpenForQueryId } =
    useModalsStore();

  // Queries
  const { queries } = useQueries();

  // Tabs
  const { getSelectedTab } = useTabsStore();

  // Actions
  const { handleSubmitQuery } = useHandleSubmitQuery();
  const { handleSaveQuery } = useHandleSaveQuery();
  const { handleDeleteQuery } = useHandleDeleteQuery();

  const selectedTab = getSelectedTab();
  const selectedQuery = selectedTab?.queryId
    ? queries[selectedTab.queryId]
    : undefined;
  const title = selectedQuery?.name ?? "Untitled query";

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
      <ConfirmModal
        isOpen={isDeleteQueryModalOpen}
        setIsOpen={setIsDeleteQueryModalOpen}
        title="Delete Query"
        text="Are you sure you would like to delete this query? This cannot be undone."
        onConfirm={() =>
          selectedQuery ? handleDeleteQuery(selectedQuery.id) : undefined
        }
      />
      <Group>
        {selectedTab && <Text color={theme.color.foreground}>{title}</Text>}
        {selectedQuery && (
          <Menu>
            <Menu.Label>Actions</Menu.Label>
            <Menu.Item
              onClick={() => setRenameModalOpenForQueryId(selectedQuery.id)}
            >
              Rename query
            </Menu.Item>
            <Menu.Item onClick={() => setIsDeleteQueryModalOpen(true)}>
              Delete query
            </Menu.Item>
          </Menu>
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
