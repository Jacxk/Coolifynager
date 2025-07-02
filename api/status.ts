import { Secrets } from "@/constants/Secrets";
import SecureStore from "@/utils/SecureStorage";

export async function getHealth(address: string): Promise<string> {
  return fetch(`${address}/api/v1/health`).then((res) => res.text());
}

export async function validateToken(
  token: string
): Promise<{ message: string; success: boolean }> {
  const address = await SecureStore.getItemAsync(Secrets.SERVER_ADDRESS);
  return fetch(`${address}/api/v1/version`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}
