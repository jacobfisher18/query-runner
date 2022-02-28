import { Button, Group, Text } from "@mantine/core";
import { useDocumentSelection } from "../hooks/useDocumentSelection";
import { useModalsStore } from "../store/modals";

function ControlBar({
  currentQueryName,
  handleQuery,
  handleSave,
  enableSave = true,
  enableSaveAs = true,
}: {
  currentQueryName?: string;
  handleQuery: () => Promise<void>;
  handleSave: () => void;
  enableSave?: boolean;
  enableSaveAs?: boolean;
}) {
  const { setIsSaveModalOpen } = useModalsStore();

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
        <Text>{currentQueryName ?? ""}</Text>
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
