import { Button, Group, Modal, Space, TextInput } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { useState } from "react";
import { useHandleSaveQueryAs } from "../hooks/useHandleSaveQueryAs";
import { useModalsStore } from "../store/modals";
import FolderSelect from "./FolderSelect";

function SaveQueryModal() {
  const [name, setName] = useState<string>();
  const [folderId, setFolderId] = useState<string>();

  const { isSaveQueryModalOpen: isOpen, setIsSaveQueryModalOpen: setIsOpen } =
    useModalsStore();

  const { handleSaveQueryAs } = useHandleSaveQueryAs();

  const hotKeys: Array<[string, (event: any) => void]> = [
    ["mod+Enter", () => handleSubmit()],
  ];

  const handleSubmit = async () => {
    const { success } = await handleSaveQueryAs(name, folderId);
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
