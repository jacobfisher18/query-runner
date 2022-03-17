import { Button, Group, Modal, Text } from "@mantine/core";

export interface ConfirmModalProps {
  title: string;
  text: string;
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
  onConfirm: () => void;
}

function ConfirmModal({
  title,
  text,
  isOpen,
  setIsOpen,
  onConfirm,
}: ConfirmModalProps) {
  const handleSubmit = async () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <Modal opened={isOpen} onClose={() => setIsOpen(false)} title={title}>
      <Text>{text}</Text>
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
          Confirm
        </Button>
      </Group>
    </Modal>
  );
}

export default ConfirmModal;
