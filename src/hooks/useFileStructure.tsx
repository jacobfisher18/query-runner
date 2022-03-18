import _ from "lodash";
import {
  UseMutateFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import {
  FileStructure,
  FileStructureData,
  fileStructureRepository,
} from "../disk/fileStructure";
import { IFileNode, IFolderNode } from "../models/fileSystem";
import { QueryKey } from "../utils/query";
import * as uuid from "uuid";

interface UseFileStructureReturn {
  fileStructure?: FileStructure;
  addFolder: UseMutateFunction<void, unknown, void, unknown>;
  addFile: UseMutateFunction<
    void,
    unknown,
    { queryId: string; folderId?: string },
    unknown
  >;
  deleteFile: UseMutateFunction<void, unknown, { queryId: string }, unknown>;
  deleteFolder: UseMutateFunction<void, unknown, string, unknown>;
  renameFolder: UseMutateFunction<
    void,
    unknown,
    { id: string; name: string },
    unknown
  >;
}

export const useFileStructure = (): UseFileStructureReturn => {
  const queryKey = [QueryKey.FileStructure];

  const queryClient = useQueryClient();

  const fileStructureQuery = useQuery({
    queryKey,
    queryFn: () => fileStructureRepository.get(),
  });

  // TODO: Allow user to select a location, rather than just pushing to the root
  const addFolderMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async () => {
      const prevFileStructure = fileStructureRepository.get();

      const newFileStructure = _.cloneDeep(prevFileStructure);
      newFileStructure.children.push({
        id: uuid.v4(),
        type: "folder",
        name: "New Folder",
        children: [],
      });

      fileStructureRepository.upsert(newFileStructure);
    },
    onSuccess: () => queryClient.invalidateQueries(QueryKey.FileStructure),
  });

  const addFileToFolder = (
    folderId: string,
    node: IFolderNode<FileStructureData>,
    file: IFileNode<FileStructureData>
  ) => {
    if (node.id === folderId) {
      node.children.push(file);
    } else {
      for (const child of node.children) {
        if (child.type === "folder") {
          addFileToFolder(folderId, child, file);
        }
      }
    }
  };

  const addFileMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async ({
      queryId,
      folderId,
    }: {
      queryId: string;
      folderId?: string;
    }) => {
      const prevFileStructure = fileStructureRepository.get();

      const newFileStructure = _.cloneDeep(prevFileStructure);

      const newFile: IFileNode<FileStructureData> = {
        id: uuid.v4(),
        type: "file",
        data: { queryId },
      };

      addFileToFolder(
        folderId ?? newFileStructure.id,
        newFileStructure,
        newFile
      );

      fileStructureRepository.upsert(newFileStructure);
    },
    onSuccess: () => queryClient.invalidateQueries(QueryKey.FileStructure),
  });

  const deleteFolderWithId = (
    node: IFolderNode<FileStructureData>,
    id: string
  ) => {
    for (const child of node.children) {
      if (child.type === "file") {
        // Ignore
      } else {
        if (child.id === id) {
          if (child.children.length) {
            alert("Cannot delete non-empty folder");
          } else {
            node.children = node.children.filter((n) => !(n.id === id));
          }
        } else {
          deleteFolderWithId(child, id);
        }
      }
    }
  };

  const deleteFolderMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async (id: string) => {
      const prevFileStructure = fileStructureRepository.get();

      const newFileStructure = _.cloneDeep(prevFileStructure);

      deleteFolderWithId(newFileStructure, id);

      fileStructureRepository.upsert(newFileStructure);
    },
    onSuccess: () => queryClient.invalidateQueries(QueryKey.FileStructure),
  });

  const renameFolderWithId = (
    node: IFolderNode<FileStructureData>,
    id: string,
    name: string
  ) => {
    if (node.id === id) {
      node.name = name;
    } else {
      for (const child of node.children) {
        if (child.type === "folder") {
          renameFolderWithId(child, id, name);
        }
      }
    }
  };

  const renameFolderMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const prevFileStructure = fileStructureRepository.get();

      const newFileStructure = _.cloneDeep(prevFileStructure);

      renameFolderWithId(newFileStructure, id, name);

      fileStructureRepository.upsert(newFileStructure);
    },
    onSuccess: () => queryClient.invalidateQueries(QueryKey.FileStructure),
  });

  const deleteFileWithQueryId = (
    node: IFolderNode<FileStructureData>,
    queryId: string
  ) => {
    for (const child of node.children) {
      if (child.type === "file") {
        if (child.data.queryId === queryId) {
          node.children = node.children.filter(
            (n) => !(n.type === "file" && n.data.queryId === queryId)
          );
        }
      } else {
        deleteFileWithQueryId(child, queryId);
      }
    }
  };

  const deleteFileMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async ({ queryId }: { queryId: string }) => {
      const prevFileStructure = fileStructureRepository.get();

      const newFileStructure = _.cloneDeep(prevFileStructure);

      deleteFileWithQueryId(newFileStructure, queryId);

      fileStructureRepository.upsert(newFileStructure);
    },
    onSuccess: () => queryClient.invalidateQueries(QueryKey.FileStructure),
  });

  return {
    fileStructure: fileStructureQuery.data,
    addFolder: addFolderMutation.mutate,
    addFile: addFileMutation.mutate,
    deleteFile: deleteFileMutation.mutate,
    deleteFolder: deleteFolderMutation.mutate,
    renameFolder: renameFolderMutation.mutate,
  };
};
