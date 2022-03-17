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
import { IFolderNode } from "../models/fileSystem";
import { QueryKey } from "../utils/query";

interface UseFileStructureReturn {
  fileStructure?: FileStructure;
  addFolder: UseMutateFunction<void, unknown, void, unknown>;
  addFile: UseMutateFunction<void, unknown, { queryId: string }, unknown>;
  deleteFile: UseMutateFunction<void, unknown, { queryId: string }, unknown>;
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
        type: "folder",
        name: "New Folder",
        children: [],
      });

      fileStructureRepository.upsert(newFileStructure);
    },
    onSuccess: () => queryClient.invalidateQueries(QueryKey.FileStructure),
  });

  // TODO: Allow user to select a location, rather than just pushing to the root
  const addFileMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async ({ queryId }: { queryId: string }) => {
      const prevFileStructure = fileStructureRepository.get();

      const newFileStructure = _.cloneDeep(prevFileStructure);
      newFileStructure.children.push({
        type: "file",
        data: { queryId },
      });

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
  };
};
