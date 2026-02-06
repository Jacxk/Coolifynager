import {
  filterResourceByTeam,
  filterResourcesByTeam,
} from "@/lib/utils";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch, optimisticUpdateOne } from "./client";
import { PrivateKey } from "./types/private-keys.types";

// Query keys
export const PrivateKeyKeys = {
  all: ["private-keys"],
  queries: {
    all: () => PrivateKeyKeys.all,
    single: (uuid: string) => [...PrivateKeyKeys.all, uuid],
  },
};

// Fetch functions
export const getPrivateKeys = async () => {
  const res = await coolifyFetch<PrivateKey[]>("/security/keys");
  const filtered = await filterResourcesByTeam(
    res,
    (key) => key.team_id,
  );
  filtered.forEach((key) =>
    optimisticUpdateOne(PrivateKeyKeys.queries.single(key.uuid), key)
  );
  return filtered;
};

export const getPrivateKey = async (uuid: string) => {
  const key = await coolifyFetch<PrivateKey>(`/security/keys/${uuid}`);
  return filterResourceByTeam(key, (k) => k.team_id);
};

// Query hooks
export const usePrivateKeys = (
  options?: Omit<UseQueryOptions<PrivateKey[], Error>, "queryKey">
) => {
  return useQuery({
    queryKey: PrivateKeyKeys.queries.all(),
    queryFn: getPrivateKeys,
    ...options,
  });
};

export const usePrivateKey = (
  uuid: string,
  options?: Omit<UseQueryOptions<PrivateKey | null, Error>, "queryKey">
) => {
  return useQuery({
    queryKey: PrivateKeyKeys.queries.single(uuid),
    queryFn: () => getPrivateKey(uuid),
    ...options,
  });
};
