import { UseQueryOptions } from "@tanstack/react-query";
import { coolifyFetch } from "./client";
import { PrivateKey } from "./types/private-keys.types";

type QueryKey = string | number;

export const getPrivateKeys = (
  options?: Omit<
    UseQueryOptions<PrivateKey[], Error, PrivateKey[], QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["private-keys"],
  queryFn: () => coolifyFetch<PrivateKey[]>("/security/keys"),
});

export const getPrivateKey = (
  uuid: string,
  options?: Omit<
    UseQueryOptions<PrivateKey, Error, PrivateKey, QueryKey[]>,
    "queryKey" | "queryFn"
  >
) => ({
  ...options,
  queryKey: ["private-keys", uuid],
  queryFn: () => coolifyFetch<PrivateKey>(`/security/keys/${uuid}`),
});
