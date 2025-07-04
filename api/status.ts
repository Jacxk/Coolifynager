import { coolifyFetch } from "./client";

export async function getHealth(address: string): Promise<string> {
  return fetch(`${address}/api/v1/health`).then((res) => res.text());
}

export async function validateToken(
  token: string
): Promise<{ message: string; success: boolean }> {
  return coolifyFetch("/version", {
    isText: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
