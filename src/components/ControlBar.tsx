import { Button, Group, Loader, Menu, Text } from "@mantine/core";
import { useDocumentSelection } from "../hooks/useDocumentSelection";
import { useModalsStore } from "../store/modals";
import { useTabsStore } from "../store/tabs";
import { useTheme } from "../hooks/useTheme";
import { useHandleSubmitQuery } from "../hooks/useHandleSubmitQuery";
import { useHandleSaveQuery } from "../hooks/useHandleSaveQuery";
import ConfirmModal from "./ConfirmModal";
import { useState } from "react";
import { useHandleDeleteQuery } from "../hooks/useHandleDeleteQuery";
import { FiCloudLightning, FiSave } from "react-icons/fi";
import { useSelectedQuery } from "../hooks/useSelectedQuery";
import { useQueryResultStore } from "../store/queryResult";

function ControlBar() {
  const theme = useTheme();

  // Local state
  const [isDeleteQueryModalOpen, setIsDeleteQueryModalOpen] =
    useState<boolean>(false);

  // Modals
  const { setIsSaveQueryModalOpen, setEditQueryModalOpenForQueryId } =
    useModalsStore();

  // Queries
  const selectedQuery = useSelectedQuery();
  const { isQueryLoading } = useQueryResultStore();

  // Tabs
  const { getSelectedTab } = useTabsStore();
  const selectedTab = getSelectedTab();

  // Actions
  const { handleSubmitQuery } = useHandleSubmitQuery();
  const { handleSaveQuery } = useHandleSaveQuery();
  const { handleDeleteQuery } = useHandleDeleteQuery();

  const title = selectedQuery?.name ?? "Untitled query";

  const documentSelection = useDocumentSelection();

  const hasExistingSavedQuery = Boolean(selectedQuery?.id);
  const hasChanges = selectedQuery?.data !== selectedTab?.data;

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
        {selectedTab && (
          <Text color={theme.color.foreground} style={{ userSelect: "none" }}>
            {title}
          </Text>
        )}
        {selectedQuery && (
          <Menu>
            <Menu.Label>Actions</Menu.Label>
            <Menu.Item
              onClick={() => setEditQueryModalOpenForQueryId(selectedQuery.id)}
            >
              Edit query
            </Menu.Item>
            <Menu.Item onClick={() => setIsDeleteQueryModalOpen(true)}>
              Delete query
            </Menu.Item>
          </Menu>
        )}
      </Group>
      <Group position="right" spacing="xs">
        {hasExistingSavedQuery && (
          <Menu>
            <Menu.Label>Actions</Menu.Label>
            <Menu.Item onClick={() => setIsSaveQueryModalOpen(true)}>
              Save as
            </Menu.Item>
          </Menu>
        )}
        <Button
          leftIcon={<FiSave />}
          variant="outline"
          size="xs"
          disabled={!hasChanges}
          onClick={() =>
            hasExistingSavedQuery
              ? handleSaveQuery()
              : setIsSaveQueryModalOpen(true)
          }
        >
          Save
        </Button>
        <Button
          leftIcon={
            isQueryLoading ? (
              <Loader size={14} color="white" />
            ) : (
              <FiCloudLightning />
            )
          }
          variant="filled"
          size="xs"
          onClick={async () => {
            await handleSubmitQuery();
          }}
        >
          {documentSelection ? "Run Selection" : "Run"}
        </Button>
      </Group>
    </Group>
  );
}

export default ControlBar;
