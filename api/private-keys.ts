import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
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
  return coolifyFetch<PrivateKey[]>("/security/keys");
};

export const getPrivateKey = async (uuid: string) => {
  return coolifyFetch<PrivateKey>(`/security/keys/${uuid}`);
};

// Query hooks
export const usePrivateKeys = (
  options?: Omit<UseQueryOptions<PrivateKey[], Error>, "queryKey">
) => {
  return useQuery({
    queryKey: PrivateKeyKeys.all,
    queryFn: getPrivateKeys,
    ...options,
  });
};

export const usePrivateKey = (
  uuid: string,
  options?: Omit<UseQueryOptions<PrivateKey, Error>, "queryKey">
) => {
  return useQuery({
    queryKey: PrivateKeyKeys.queries.single(uuid),
    queryFn: () => getPrivateKey(uuid),
    ...options,
  });
};
