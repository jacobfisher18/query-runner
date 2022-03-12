import { Button, Group, Modal, TextInput } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { useState } from "react";
import { useHandleSaveQueryAs } from "../hooks/useHandleSaveQueryAs";
import { useModalsStore } from "../store/modals";

function SaveQueryModal() {
  const [name, setName] = useState<string>();

  const { isSaveQueryModalOpen: isOpen, setIsSaveQueryModalOpen: setIsOpen } =
    useModalsStore();

  const { handleSaveQueryAs } = useHandleSaveQueryAs();

  const hotKeys: Array<[string, (event: any) => void]> = [
    ["mod+Enter", () => handleSubmit()],
  ];

  const handleSubmit = async () => {
    const { success } = handleSaveQueryAs(name);
    if (success) {
      setIsOpen(false);
    }
  };

  return (
    <Modal opened={isOpen} onClose={() => setIsOpen(false)} title="Save query">
      <TextInput
        placeholder="main"
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
            setIsOpen(false);
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

export default SaveQueryModal;
