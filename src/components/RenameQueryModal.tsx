import { Button, Group, Modal, TextInput } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { useState } from "react";
import { useHandleRenameQuery } from "../hooks/useHandleRenameQuery";
import { useModalsStore } from "../store/modals";

function RenameQueryModal() {
  const [name, setName] = useState<string>();

  const {
    renameModalOpenForQueryId: queryId,
    setRenameModalOpenForQueryId: setOpenForQueryId,
  } = useModalsStore();
  const isOpen = Boolean(queryId);

  const { handleRenameQuery } = useHandleRenameQuery();

  const hotKeys: Array<[string, (event: any) => void]> = [
    ["mod+Enter", () => handleSubmit()],
  ];

  const handleSubmit = async () => {
    const { success } = handleRenameQuery(queryId ?? undefined, name);
    if (success) {
      setOpenForQueryId(null);
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={() => setOpenForQueryId(null)}
      title="Rename query"
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

export default RenameQueryModal;
