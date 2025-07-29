import { queryClient } from "@/app/_layout";
import { Secrets } from "@/constants/Secrets";
import * as SecureStore from "expo-secure-store";

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

  if (process.env.NODE_ENV === "development") {
    const delay = Math.random() * 1000 + 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

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

export async function optimisticUpdateInsertOneToMany<
  T extends { uuid?: string }
>(queryKey: (string | number)[], data: T) {
  await queryClient.cancelQueries({ queryKey });

  const previousData = queryClient.getQueryData<T>(queryKey);

  queryClient.setQueryData(queryKey, (old: T[] | undefined) => {
    if (!old) return [data];

    const index = old.findIndex(
      (resource) => data.uuid && resource.uuid === data.uuid
    );
    if (index === -1) return [...old, data];

    return old.map((resource) =>
      data.uuid && resource.uuid === data.uuid
        ? { ...resource, ...data }
        : resource
    );
  });

  return { previousData, queryKey };
}

export async function optimisticUpdateOne<T>(
  queryKey: (string | number)[],
  data: T
) {
  await queryClient.cancelQueries({ queryKey });

  const previousData = queryClient.getQueryData<T>(queryKey);

  queryClient.setQueryData(queryKey, (old: T | undefined) => {
    if (!old) return data;
    return { ...old, ...data };
  });

  return { previousData, queryKey };
}

export const onOptimisticUpdateError = (
  data: unknown,
  error: unknown,
  variables: unknown,
  context?: { queryKey: (string | number)[]; previousData: unknown }
) => {
  if (!context) return;
  queryClient.setQueryData(context.queryKey, context.previousData);
};

export const onOptimisticUpdateSettled = (customKey?: (string | number)[]) => {
  return (
    data?: unknown,
    error?: unknown,
    variables?: unknown,
    context?: { queryKey: (string | number)[] }
  ) => {
    queryClient.invalidateQueries({
      queryKey: customKey ?? context?.queryKey,
    });
  };
};
