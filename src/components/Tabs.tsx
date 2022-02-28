import { Group, Text } from "@mantine/core";
import styled from "styled-components";
import { MdOutlineClose, MdOutlineAdd } from "react-icons/md";

export interface TabElement {
  label: string;
  onSelect: () => void;
  onClose: () => void;
  isActive: boolean;
  hasChanges: boolean;
}

function NewTab({ onClick }: { onClick: () => void }) {
  return (
    <NewTabContainer onClick={onClick}>
      <MdOutlineAdd size={15} />
    </NewTabContainer>
  );
}

function Tab({
  label,
  isActive = false,
  onSelect,
  onClose,
  hasChanges,
}: TabElement) {
  return (
    <TabContainer isActive={isActive} onClick={onSelect}>
      <Text
        size="sm"
        mr={4}
        sx={() => ({
          fontStyle: hasChanges ? "italic" : "normal",
          "&:hover": {
            cursor: "default",
          },
        })}
      >
        {label}
      </Text>
      <RemoveIconContainer onClick={onClose}>
        <MdOutlineClose size={15} />
      </RemoveIconContainer>
    </TabContainer>
  );
}

function Tabs({
  elements,
  onNewTab,
}: {
  elements: Array<TabElement>;
  onNewTab?: () => void;
}) {
  return (
    <Group style={{ padding: "10px 10px" }} spacing={5}>
      {elements.map((e, i) => (
        <Tab
          key={i}
          label={e.label}
          isActive={e.isActive}
          onSelect={e.onSelect}
          onClose={e.onClose}
          hasChanges={e.hasChanges}
        />
      ))}
      {onNewTab && <NewTab onClick={onNewTab} />}
    </Group>
  );
}

const TabContainer = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${(p) => (p.isActive ? "#eee" : "#fff")};
  padding: 5px 15px;
  border-radius: 5px;

  &:hover {
    background-color: #eee;
  }
`;

const NewTabContainer = styled.div`
  margin-left: 10px;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 10px;
  border-radius: 5px;

  &:hover {
    background-color: #eee;
    cursor: pointer;
  }
`;

const RemoveIconContainer = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;

  /** Correct height weirdness */
  padding-top: 1px;

  &:hover {
    cursor: pointer;
    background-color: #ddd;
  }
`;

export default Tabs;
