import { Group, Text } from "@mantine/core";
import styled from "styled-components";
import { MdOutlineClose, MdOutlineAdd } from "react-icons/md";
import { useTheme } from "../hooks/useTheme";
import { useTabsStore } from "../store/tabs";
import { isTruthy } from "../utils/nil";

export interface TabElement {
  label: string;
  onSelect: () => void;
  onClose: () => void;
  isActive: boolean;
  hasChanges: boolean;
}

function NewTab({ onClick }: { onClick: () => void }) {
  const theme = useTheme();

  return (
    <NewTabContainer onClick={onClick}>
      <MdOutlineAdd size={15} color={theme.color.foreground} />
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
  const theme = useTheme();

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
          color: theme.color.foreground,
        })}
      >
        {label}
      </Text>
      <RemoveIconContainer onClick={onClose}>
        <MdOutlineClose size={15} color={theme.color.foreground} />
      </RemoveIconContainer>
    </TabContainer>
  );
}

function Tabs() {
  const { tabs, removeTab, selectTab, selectedTabId, addTab } = useTabsStore();

  const elements =
    Object.values(tabs)
      .filter(isTruthy)
      .map((t) => {
        return {
          isActive: selectedTabId === t.id,
          label: t.title ?? "Untitled query",
          onClose: () => removeTab(t.id),
          onSelect: () => selectTab(t.id),
          hasChanges: t.initialData !== t.data,
        };
      }) ?? [];

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
      {<NewTab onClick={addTab} />}
    </Group>
  );
}

const TabContainer = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${(p) =>
    p.isActive ? p.theme.color.backgroundSecondary : p.theme.color.background};
  padding: 5px 15px;
  border-radius: 5px;

  &:hover {
    background-color: ${(p) => p.theme.color.backgroundSecondary};
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
    background-color: ${(p) => p.theme.color.backgroundSecondary};
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
    background-color: ${(p) => p.theme.color.backgroundSecondaryHover};
  }
`;

export default Tabs;
