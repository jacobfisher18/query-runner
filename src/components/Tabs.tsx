import { Group, Text } from "@mantine/core";
import styled from "styled-components";
import { MdOutlineClose, MdOutlineAdd } from "react-icons/md";
import { getTheme, useTheme } from "../hooks/useTheme";
import { useTabsStore } from "../store/tabs";
import { isTruthy } from "../utils/nil";
import { useQueries } from "../hooks/useQueries";

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
          textOverflow: "ellipsis",
          overflow: "hidden",
          fontStyle: hasChanges ? "italic" : "normal",
          "&:hover": {
            cursor: "default",
          },
          color: theme.color.foreground,
          userSelect: "none",
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

  const { queries } = useQueries();

  return (
    <Group
      style={{
        padding: "10px 10px",
        overflowX: "scroll",
        whiteSpace: "nowrap",
        flexWrap: "nowrap",
      }}
      spacing={5}
    >
      {Object.values(tabs)
        .filter(isTruthy)
        .map((t, i) => {
          const query = t.queryId ? queries[t.queryId] ?? null : null;
          return (
            <Tab
              key={i}
              label={query?.name ?? "Untitled query"}
              isActive={selectedTabId === t.id}
              onSelect={() => selectTab(t.id)}
              onClose={() => removeTab(t.id)}
              hasChanges={query?.data !== t.data}
            />
          );
        })}
      <NewTab onClick={addTab} />
    </Group>
  );
}

const TabContainer = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${(p) =>
    p.isActive
      ? getTheme(p).color.backgroundSecondary
      : getTheme(p).color.background};
  padding: 5px 15px;
  border-radius: 5px;
  max-width: 150px;
  white-space: nowrap;

  &:hover {
    background-color: ${(p) => getTheme(p).color.backgroundSecondary};
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
    background-color: ${(p) => getTheme(p).color.backgroundSecondary};
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
    background-color: ${(p) => getTheme(p).color.backgroundSecondaryHover};
  }
`;

export default Tabs;
