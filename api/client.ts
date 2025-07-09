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

  const response = await fetch(url, fetchOptions);

  if (isText) {
    return (await response.text()) as T;
  }

  return await response.json();
}
