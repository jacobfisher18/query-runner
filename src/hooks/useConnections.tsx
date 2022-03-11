import {
  UseMutateFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import {
  addConnection,
  deleteConnection,
  getConnections,
  saveConnection,
} from "../disk/connection";
import { Connection } from "../store/connections";
import { context } from "../store/user";
import { QueryKey } from "../utils/query";

interface UseConnectionReturn {
  connections?: Record<string, Connection | undefined>;
  addConnection: UseMutateFunction<void, unknown, void, unknown>;
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
    queryFn: () => getConnections(context.userId, context.workspaceId),
  });

  const addMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async () => {
      addConnection(context.userId, context.workspaceId, {
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
      saveConnection(context.userId, context.workspaceId, id, data);
    },
    onSuccess: () => queryClient.invalidateQueries(QueryKey.Connections),
  });

  const deleteMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async (id: string) => {
      deleteConnection(context.userId, context.workspaceId, id);
    },
    onSuccess: () => queryClient.invalidateQueries(QueryKey.Connections),
  });

  return {
    connections: connectionsQuery.data,
    addConnection: addMutation.mutate,
    saveConnection: saveMutation.mutate,
    deleteConnection: deleteMutation.mutate,
  };
};
