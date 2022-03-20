import { FileStructureData } from "../disk/fileStructure";
import { IFileNode, IFolderNode } from "../models/fileSystem";

class FileStructureManager {
  /**
   * Finds a file and the folder that contains it.
   */
  public findFile(
    node: IFolderNode<FileStructureData>,
    { queryId }: { queryId: string }
  ): {
    file: IFileNode<FileStructureData>;
    folder: IFolderNode<FileStructureData>;
  } | null {
    for (const child of node.children) {
      if (child.type === "file") {
        if (child.data.queryId === queryId) {
          return { file: child, folder: node };
        }
      } else {
        const file = this.findFile(child, { queryId });
        if (file) {
          return file;
        }
      }
    }

    return null;
  }

  public addFileToFolder(
    node: IFolderNode<FileStructureData>,
    {
      folderId,
      file,
    }: {
      folderId: string;
      file: IFileNode<FileStructureData>;
    }
  ) {
    if (node.id === folderId) {
      node.children.push(file);
    } else {
      for (const child of node.children) {
        if (child.type === "folder") {
          this.addFileToFolder(child, { folderId, file });
        }
      }
    }
  }

  public deleteFileWithQueryId(
    node: IFolderNode<FileStructureData>,
    { queryId }: { queryId: string }
  ): IFileNode<FileStructureData> | null {
    for (const child of node.children) {
      if (child.type === "file") {
        if (child.data.queryId === queryId) {
          node.children = node.children.filter(
            (n) => !(n.type === "file" && n.data.queryId === queryId)
          );
          return child;
        }
      } else {
        const file = this.deleteFileWithQueryId(child, { queryId });
        if (file) {
          return file;
        }
      }
    }

    return null;
  }

  public moveFileToFolder(
    node: IFolderNode<FileStructureData>,
    { folderId, queryId }: { folderId: string; queryId: string }
  ) {
    // Remove file from existing location
    const file = this.deleteFileWithQueryId(node, { queryId });

    // Add file to new location
    if (file) {
      this.addFileToFolder(node, { folderId, file });
    } else {
      alert("Could not find file to move");
    }
  }

  public deleteFolderWithId(
    node: IFolderNode<FileStructureData>,
    { folderId }: { folderId: string }
  ) {
    for (const child of node.children) {
      if (child.type === "folder") {
        if (child.id === folderId) {
          if (child.children.length) {
            alert("Cannot delete non-empty folder");
          } else {
            node.children = node.children.filter((n) => !(n.id === folderId));
          }
        } else {
          this.deleteFolderWithId(child, { folderId });
        }
      }
    }
  }

  public renameFolderWithId(
    node: IFolderNode<FileStructureData>,
    { folderId, name }: { folderId: string; name: string }
  ) {
    if (node.id === folderId) {
      node.name = name;
    } else {
      for (const child of node.children) {
        if (child.type === "folder") {
          this.renameFolderWithId(child, { folderId, name });
        }
      }
    }
  }
}

export const fileStructureManager = new FileStructureManager();
