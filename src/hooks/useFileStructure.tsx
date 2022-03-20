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
import { fileStructureManager } from "../managers/fileStructureManager";

// Helper type that simplifies working with the React Query type
type MutateFunction<Variables> = UseMutateFunction<
  void,
  unknown,
  Variables,
  unknown
>;

interface UseFileStructureReturn {
  fileStructure?: FileStructure;
  findFile: (queryId: string) => {
    file: IFileNode<FileStructureData>;
    folder: IFolderNode<FileStructureData>;
  } | null;
  addFolder: MutateFunction<void>;
  addFile: MutateFunction<{ queryId: string; folderId?: string }>;
  deleteFile: MutateFunction<{ queryId: string }>;
  moveFile: MutateFunction<{ queryId: string; folderId: string }>;
  deleteFolder: MutateFunction<string>;
  renameFolder: MutateFunction<{ id: string; name: string }>;
}

export const useFileStructure = (): UseFileStructureReturn => {
  const queryKey = [QueryKey.FileStructure];

  const queryClient = useQueryClient();

  const fileStructureQuery = useQuery({
    queryKey,
    queryFn: () => fileStructureRepository.get(),
  });

  const findFile = (
    queryId: string
  ): {
    file: IFileNode<FileStructureData>;
    folder: IFolderNode<FileStructureData>;
  } | null => {
    const fileStructure = fileStructureRepository.get();
    return fileStructureManager.findFile(fileStructure, { queryId });
  };

  // TODO: Allow user to select a location, rather than just pushing to the root
  const addFolderMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async () => {
      const fileStructure = fileStructureRepository.get();
      fileStructure.children.push({
        id: uuid.v4(),
        type: "folder",
        name: "New Folder",
        children: [],
      });

      fileStructureRepository.upsert(fileStructure);
    },
    onSuccess: () => queryClient.invalidateQueries(QueryKey.FileStructure),
  });

  const addFileMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async ({
      queryId,
      folderId,
    }: {
      queryId: string;
      folderId?: string;
    }) => {
      const fileStructure = fileStructureRepository.get();
      const file: IFileNode<FileStructureData> = {
        id: uuid.v4(),
        type: "file",
        data: { queryId },
      };

      fileStructureManager.addFileToFolder(fileStructure, {
        folderId: folderId ?? fileStructure.id,
        file,
      });
      fileStructureRepository.upsert(fileStructure);
    },
    onSuccess: () => queryClient.invalidateQueries(QueryKey.FileStructure),
  });

  const deleteFolderMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async (id: string) => {
      const fileStructure = fileStructureRepository.get();
      fileStructureManager.deleteFolderWithId(fileStructure, { folderId: id });
      fileStructureRepository.upsert(fileStructure);
    },
    onSuccess: () => queryClient.invalidateQueries(QueryKey.FileStructure),
  });

  const renameFolderMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const fileStructure = fileStructureRepository.get();
      fileStructureManager.renameFolderWithId(fileStructure, {
        folderId: id,
        name,
      });
      fileStructureRepository.upsert(fileStructure);
    },
    onSuccess: () => queryClient.invalidateQueries(QueryKey.FileStructure),
  });

  const deleteFileMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async ({ queryId }: { queryId: string }) => {
      const fileStructure = fileStructureRepository.get();
      fileStructureManager.deleteFileWithQueryId(fileStructure, { queryId });
      fileStructureRepository.upsert(fileStructure);
    },
    onSuccess: () => queryClient.invalidateQueries(QueryKey.FileStructure),
  });

  const moveFileMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async ({
      queryId,
      folderId,
    }: {
      queryId: string;
      folderId: string;
    }) => {
      const fileStructure = fileStructureRepository.get();
      fileStructureManager.moveFileToFolder(fileStructure, {
        queryId,
        folderId,
      });
      fileStructureRepository.upsert(fileStructure);
    },
    onSuccess: () => queryClient.invalidateQueries(QueryKey.FileStructure),
  });

  return {
    fileStructure: fileStructureQuery.data,
    addFolder: addFolderMutation.mutate,
    addFile: addFileMutation.mutate,
    findFile,
    deleteFile: deleteFileMutation.mutate,
    moveFile: moveFileMutation.mutate,
    deleteFolder: deleteFolderMutation.mutate,
    renameFolder: renameFolderMutation.mutate,
  };
};
