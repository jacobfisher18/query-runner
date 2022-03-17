import {
  UseMutateFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { connectionRepository } from "../disk/connection";
import { Connection } from "../models/connection";
import { QueryKey } from "../utils/query";

interface UseConnectionReturn {
  connections?: Record<string, Connection | undefined>;
  createConnection: UseMutateFunction<void, unknown, void, unknown>;
  saveConnection: UseMutateFunction<
    void,
    unknown,
    { id: string; data: Partial<Connection> },
    unknown
  >;
  deleteConnection: UseMutateFunction<void, unknown, string, unknown>;
}

export const useConnections = (): UseConnectionReturn => {
  const queryKey = [QueryKey.Connections];

  const queryClient = useQueryClient();

  const connectionsQuery = useQuery({
    queryKey,
    queryFn: () => connectionRepository.get(),
  });

  const createMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async () => {
      connectionRepository.create({
        name: "Untitled Connection",
      });
    },
    onSuccess: () => queryClient.invalidateQueries(QueryKey.Connections),
  });

  const saveMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Connection>;
    }) => {
      connectionRepository.save(id, data);
    },
    onSuccess: () => queryClient.invalidateQueries(QueryKey.Connections),
  });

  const deleteMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async (id: string) => {
      connectionRepository.delete(id);
    },
    onSuccess: () => queryClient.invalidateQueries(QueryKey.Connections),
  });

  return {
    connections: connectionsQuery.data,
    createConnection: createMutation.mutate,
    saveConnection: saveMutation.mutate,
    deleteConnection: deleteMutation.mutate,
  };
};
