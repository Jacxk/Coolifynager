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
  } = {},
): Promise<T> {
  const { method = "GET", body, headers = {}, isText = false } = options;
  const serverAddress = await SecureStore.getItemAsync(Secrets.SERVER_ADDRESS);
  if (!serverAddress) throw new Error("Server address not found");

  const url = `${serverAddress}/api/v1${endpoint}`;

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

  try {
    const response = await fetch(url, fetchOptions);
    console.log(`[${method}] [${response.status}] ${endpoint}`);

    if (response.status >= 400) {
      const error = await response.json();
      throw error;
    }

    if (isText) {
      return (await response.text()) as T;
    }

    return await response.json();
  } catch (error) {
    console.error(`Network request failed for ${endpoint}:`, error);
    throw error;
  }
}

export async function optimisticUpdateInsertOneToMany<
  T extends { uuid?: string; deployment_uuid?: string },
>(queryKey: (string | number)[], data: T) {
  await queryClient.cancelQueries({ queryKey });

  const previousData = queryClient.getQueryData<T[]>(queryKey);

  queryClient.setQueryData(queryKey, (old: T[] | undefined) => {
    if (!old) return [data];

    const identifierKey = data.deployment_uuid ? "deployment_uuid" : "uuid";
    const identifierValue = data.deployment_uuid ?? data.uuid;

    if (!identifierValue) return [...old, data];

    const index = old.findIndex(
      (resource) =>
        (identifierKey === "deployment_uuid" &&
          resource.deployment_uuid === identifierValue) ||
        (identifierKey === "uuid" && resource.uuid === identifierValue),
    );

    if (index === -1) return [...old, data];

    return old.map((resource) =>
      (identifierKey === "deployment_uuid" &&
        resource.deployment_uuid === identifierValue) ||
      (identifierKey === "uuid" && resource.uuid === identifierValue)
        ? { ...resource, ...data }
        : resource,
    );
  });

  return { previousData, queryKey };
}

export async function optimisticUpdateOne<T>(
  queryKey: (string | number)[],
  data: T,
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
  context?: {
    queryKey: (string | number)[];
    previousData: unknown;
    queryKeyAll?: (string | number)[];
    previousDataAll?: unknown;
  },
) => {
  if (!context) return;
  queryClient.setQueryData(context.queryKey, context.previousData);

  // Handle multiple query updates (like delete operations)
  if (context.queryKeyAll && context.previousDataAll !== undefined) {
    queryClient.setQueryData(context.queryKeyAll, context.previousDataAll);
  }
};

export const onOptimisticUpdateSettled = (customKey?: (string | number)[]) => {
  return (
    data?: unknown,
    error?: unknown,
    variables?: unknown,
    context?: { queryKey: (string | number)[] },
  ) => {
    queryClient.invalidateQueries({
      queryKey: customKey ?? context?.queryKey,
    });
  };
};
