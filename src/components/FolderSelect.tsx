import { Button, Table, Text } from "@mantine/core";
import _ from "lodash";
import { useState } from "react";
import styled from "styled-components";
import { FileStructureData } from "../disk/fileStructure";
import { useFileStructure } from "../hooks/useFileStructure";
import { useTheme } from "../hooks/useTheme";
import { IFolderNode } from "../models/fileSystem";
import { Stack } from "../utils/stack";

function FolderSelect({
  label,
  onSelect,
}: {
  label?: string;
  onSelect: (id: string) => void;
}) {
  const theme = useTheme();

  const { fileStructure } = useFileStructure();

  const [stack, setStack] = useState<Stack<IFolderNode<FileStructureData>>>(
    new Stack(fileStructure ? [fileStructure] : undefined)
  );

  const currentNode = stack.peek();

  const canGoBack = stack.size() > 1;

  return (
    <>
      {label && (
        <Text
          size="sm"
          weight={500}
          color={theme.color.foreground}
          style={{ marginBottom: 4 }}
        >
          {label}
        </Text>
      )}
      <Container>
        <Header>
          <Text sx={{ color: theme.color.foreground }} size="sm">
            {currentNode?.name}
          </Text>
        </Header>
        <Content>
          <Table highlightOnHover>
            <tbody>
              {currentNode?.children.map((c, i) => {
                if (c.type === "file") return null;
                return (
                  <tr key={i}>
                    <Option
                      onClick={() => {
                        onSelect(c.id);
                        setStack((prevStack) => {
                          const newStack = _.cloneDeep(prevStack);
                          newStack.push(c);
                          return newStack;
                        });
                      }}
                    >
                      {c.name}
                    </Option>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Content>
        <Controls>
          {
            <Button
              size="xs"
              disabled={!canGoBack}
              onClick={() => {
                setStack((prevStack) => {
                  const newStack = _.cloneDeep(prevStack);
                  newStack.pop();
                  return newStack;
                });
              }}
            >
              Back
            </Button>
          }
        </Controls>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;

  border: 1px solid
    ${(p) =>
      p.theme.colorScheme === "dark"
        ? p.theme.colors.dark[5]
        : p.theme.colors.gray[4]};
  border-radius: 5px;
  height: 300px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px;

  border-bottom: 1px solid
    ${(p) =>
      p.theme.colorScheme === "dark"
        ? p.theme.colors.dark[5]
        : p.theme.colors.gray[4]};

  background-color: ${(p) =>
    p.theme.colorScheme === "dark"
      ? p.theme.colors.dark[5]
      : p.theme.colors.gray[0]};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  overflow-y: scroll;
`;

const Option = styled.td`
  &:hover {
    cursor: pointer;
  }
`;

const Controls = styled.div`
  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: flex-start;
  padding: 10px 10px;

  border-top: 1px solid
    ${(p) =>
      p.theme.colorScheme === "dark"
        ? p.theme.colors.dark[5]
        : p.theme.colors.gray[4]};
`;

export default FolderSelect;
