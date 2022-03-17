import {
  UseMutateAsyncFunction,
  UseMutateFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { queryRepository } from "../disk/query";
import { Query } from "../models/query";
import { QueryKey } from "../utils/query";

interface UseQueryReturn {
  queries: Record<string, Query | undefined>;
  createQuery: UseMutateAsyncFunction<
    [string, Query],
    unknown,
    Omit<Query, "id">,
    unknown
  >;
  saveQuery: UseMutateFunction<
    void,
    unknown,
    { id: string; data: Partial<Query> },
    unknown
  >;
  deleteQuery: UseMutateFunction<void, unknown, string, unknown>;
}

export const useQueries = (): UseQueryReturn => {
  const queryKey = [QueryKey.Queries];

  const queryClient = useQueryClient();

  const queriesQuery = useQuery({
    queryKey,
    queryFn: () => queryRepository.get(),
  });

  const createMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async (data: Omit<Query, "id">) => {
      return queryRepository.create(data);
    },
    onSuccess: () => queryClient.invalidateQueries(QueryKey.Queries),
  });

  const saveMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async ({ id, data }: { id: string; data: Partial<Query> }) => {
      queryRepository.save(id, data);
    },
    onSuccess: () => queryClient.invalidateQueries(QueryKey.Queries),
  });

  const deleteMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async (id: string) => {
      queryRepository.delete(id);
    },
    onSuccess: () => queryClient.invalidateQueries(QueryKey.Queries),
  });

  return {
    queries: queriesQuery.data || {},
    createQuery: createMutation.mutateAsync,
    saveQuery: saveMutation.mutate,
    deleteQuery: deleteMutation.mutate,
  };
};
