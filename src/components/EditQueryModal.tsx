import { Button, Group, Modal, Space, TextInput } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useFileStructure } from "../hooks/useFileStructure";
import { useQueries } from "../hooks/useQueries";
import { useModalsStore } from "../store/modals";
import FolderSelect from "./FolderSelect";

function EditQueryModal() {
  const {
    editQueryModalOpenForQueryId: queryId,
    setEditQueryModalOpenForQueryId: setOpenForQueryId,
  } = useModalsStore();
  const isOpen = Boolean(queryId);

  const { moveFile } = useFileStructure();

  const { queries, saveQuery } = useQueries();
  const query = queryId ? queries[queryId] : undefined;

  const [name, setName] = useState<string | undefined>(query?.name);
  const [folderId, setFolderId] = useState<string | undefined>();

  const hotKeys: Array<[string, (event: any) => void]> = [
    ["mod+Enter", () => handleSubmit()],
  ];

  const handleSubmit = async () => {
    if (!queryId) {
      alert("Cannot save non-existent query.");
      return;
    }

    saveQuery({ id: queryId, data: { name } });

    if (folderId) {
      moveFile({ queryId, folderId });
    }

    setOpenForQueryId(null);
  };

  useEffect(() => {
    // Reset initial state when this modal is opened for a new query
    setName(query?.name);
    setFolderId(undefined);
  }, [query]);

  return (
    <Modal
      opened={isOpen}
      onClose={() => setOpenForQueryId(null)}
      title="Edit query"
    >
      <TextInput
        placeholder="main.sql"
        label="Query name"
        description="Please enter a name for this query. Press ⌘+Enter to save."
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={getHotkeyHandler(hotKeys)}
      />
      <Space h={20} />
      <FolderSelect onSelect={(id) => setFolderId(id)} label="Save to folder" />
      <Group mt="xl" position="right">
        <Button
          variant="outline"
          onClick={async () => {
            setOpenForQueryId(null);
          }}
        >
          Cancel
        </Button>
        <Button variant="filled" onClick={handleSubmit}>
          Save
        </Button>
      </Group>
    </Modal>
  );
}

export default EditQueryModal;
