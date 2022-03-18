import styled from "styled-components";
import { Collapse, Group, Menu, Space, Text, TextInput } from "@mantine/core";
import { useTheme } from "../hooks/useTheme";
import { useHandleSelectQuery } from "../hooks/useHandleSelectQuery";
import { useState } from "react";
import { VscChevronDown, VscChevronRight } from "react-icons/vsc";
import { FaDatabase } from "react-icons/fa";
import { IFileNode, IFileSystemNode, IFolderNode } from "../models/fileSystem";
import { useFileStructure } from "../hooks/useFileStructure";
import { FileStructureData } from "../disk/fileStructure";
import { useQueries } from "../hooks/useQueries";
import { getHotkeyHandler } from "@mantine/hooks";

const ICON_SIZE = 13;

const FileNode = ({
  node,
}: {
  node: IFileNode<FileStructureData> & { depth: number; path: string };
}): JSX.Element => {
  const theme = useTheme();

  const { queries } = useQueries();

  const { handleSelectQuery } = useHandleSelectQuery();

  const query = queries[node.data.queryId];

  return (
    <FileSystemNodeContainer>
      <NodeContainer
        depth={node.depth}
        onClick={() => (query ? handleSelectQuery(query) : null)}
      >
        <NodeIconTextContainer>
          <FaDatabase color={theme.colors.blue[6]} size={ICON_SIZE} />
          <Space w={8} />
          <Text
            size="sm"
            style={{ userSelect: "none" }}
            color={theme.color.foreground}
          >
            {query?.name ?? "Unknown"}
          </Text>
        </NodeIconTextContainer>
      </NodeContainer>
    </FileSystemNodeContainer>
  );
};

const FolderNode = ({
  node,
}: {
  node: IFolderNode<FileStructureData> & { depth: number; path: string };
}): JSX.Element => {
  const theme = useTheme();
  const [opened, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(node.name);

  const toggleOpen = () => setOpen((o) => !o);

  const { deleteFolder, renameFolder } = useFileStructure();

  const handleDelete = () => {
    deleteFolder(node.id);
  };

  const handleRename = () => {
    renameFolder({ id: node.id, name });
    setIsEditing(false);
  };

  const hotKeys: Array<[string, (event: any) => void]> = [
    ["mod+Enter", () => handleRename()],
  ];

  return (
    <FileSystemNodeContainer>
      <NodeContainer onClick={toggleOpen} depth={node.depth}>
        <NodeIconTextContainer>
          {opened ? (
            <VscChevronDown size={ICON_SIZE} color={theme.color.foreground} />
          ) : (
            <VscChevronRight size={ICON_SIZE} color={theme.color.foreground} />
          )}
          <Space w={8} />
          {isEditing ? (
            <TextInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              size="xs"
              variant="default"
              // TODO: Make this work better
              onBlur={() => setIsEditing(false)}
              onKeyDown={getHotkeyHandler(hotKeys)}
            />
          ) : (
            <Text
              size="sm"
              style={{ userSelect: "none" }}
              color={theme.color.foreground}
            >
              {node.name}
            </Text>
          )}
        </NodeIconTextContainer>
        <Menu
          onClick={(e) => e.stopPropagation()}
          sx={{
            "> button": { "&:hover": { background: "none" } },
          }}
        >
          <Menu.Label>Actions</Menu.Label>
          <Menu.Item onClick={handleDelete}>Delete folder</Menu.Item>
          <Menu.Item
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Rename folder
          </Menu.Item>
        </Menu>
      </NodeContainer>
      <FolderChildrenContainer>
        <Collapse in={opened} transitionDuration={0}>
          {node.children.map((n) =>
            getFileSystemNode({
              node: {
                ...n,
                depth: node.depth + 1,
                path: `${node.path}/${node.name}`,
              },
            })
          )}
        </Collapse>
      </FolderChildrenContainer>
    </FileSystemNodeContainer>
  );
};

const getFileSystemNode = ({
  node,
}: {
  node: IFileSystemNode<FileStructureData> & { depth: number; path: string };
}): JSX.Element => {
  return node.type === "file" ? (
    <FileNode node={node} />
  ) : (
    <FolderNode node={node} />
  );
};

function FileManager(): JSX.Element {
  const { fileStructure, addFolder } = useFileStructure();

  const handleAddFolder = () => {
    addFolder();
  };

  return (
    <Container>
      <Group direction="row" position="apart">
        <div></div>
        <Menu>
          <Menu.Label>Actions</Menu.Label>
          <Menu.Item onClick={handleAddFolder}>Add Folder</Menu.Item>
        </Menu>
      </Group>
      {fileStructure?.children.map((n) =>
        getFileSystemNode({ node: { ...n, depth: 1, path: "" } })
      )}
    </Container>
  );
}

const Container = styled.div`
  background-color: ${(p) => p.theme.color.backgroundSecondary};
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 100%;
  padding: 15px 15px 15px 15px;
`;

const FileSystemNodeContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const NodeContainer = styled.div<{ depth: number }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  /* This allows us to adjust padding only while still allowing all elements
  to take up the full width of the container. */
  padding-left: ${(p) => p.depth * 14}px;
  padding-top: 1px;
  padding-bottom: 1px;

  &:hover {
    cursor: pointer;
    background-color: ${(p) => p.theme.color.backgroundSecondaryHover};
  }
`;

const NodeIconTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const FolderChildrenContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default FileManager;
