import { Button, Group, Modal, TextInput } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { useState } from "react";
import { useModalsStore } from "../store/modals";

function SaveModal({
  handleSaveAs,
}: {
  handleSaveAs: (name?: string) => { success: boolean };
}) {
  const [name, setName] = useState<string>();

  const { isSaveModalOpen, setIsSaveModalOpen } = useModalsStore();

  const hotKeys: Array<[string, (event: any) => void]> = [
    ["mod+Enter", () => onSaveAttempt()],
  ];

  const onSaveAttempt = async () => {
    const { success } = handleSaveAs(name);
    if (success) {
      setIsSaveModalOpen(false);
    }
  };

  return (
    <Modal
      opened={isSaveModalOpen}
      onClose={() => setIsSaveModalOpen(false)}
      title="Save query"
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
            setIsSaveModalOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button variant="filled" onClick={onSaveAttempt}>
          Save
        </Button>
      </Group>
    </Modal>
  );
}

export default SaveModal;
