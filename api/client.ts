import { queryClient } from "@/app/_layout";
import { Secrets } from "@/constants/Secrets";
import * as SecureStore from "expo-secure-store";
import { ResourceBase } from "./types/resources.types";

export async function coolifyFetch<T>(
  endpoint: string,
  options: {
    isText?: boolean;
    method?: string;
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, isText = false } = options;
  const serverAddress = await SecureStore.getItemAsync(Secrets.SERVER_ADDRESS);
  if (!serverAddress) throw new Error("Server address not found");

  const url = `${serverAddress}/api/v1${endpoint}`;

  console.log(`[${method}] ${endpoint}`);

  const token = await SecureStore.getItemAsync(Secrets.API_TOKEN);
  if (!headers.Authorization && !token) throw new Error("API token not found");

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const response = await fetch(url, fetchOptions);

  if (response.status >= 400) {
    const error = await response.json();
    throw error;
  }

  if (isText) {
    return (await response.text()) as T;
  }

  return await response.json();
}

export function optimisticUpdateMany<T extends Partial<ResourceBase>>(
  queryKey: (string | number)[],
  data: T
) {
  queryClient.setQueryData(queryKey, (old: T[] | undefined) => {
    if (!old) return [data];

    const index = old.findIndex((resource) => resource.uuid === data.uuid);
    if (index === -1) {
      // Add new item if it doesn't exist
      return [...old, data];
    } else {
      // Update existing item
      return old.map((resource) =>
        resource.uuid === data.uuid ? { ...resource, ...data } : resource
      );
    }
  });
}

export function optimisticUpdate<T>(queryKey: (string | number)[], data: T) {
  queryClient.setQueryData(queryKey, (old: T | undefined) => {
    if (!old) return data;
    return { ...old, ...data };
  });
}
