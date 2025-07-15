import { coolifyFetch } from "./client";

type VersionResponse = {
  message: string;
  success: boolean;
};

export async function getHealth(address: string): Promise<string> {
  const normalizedAddress = address.replace(/\/+$/, "");
  return fetch(`${normalizedAddress}/api/v1/health`).then((res) => res.text());
}

export async function validateToken(token: string) {
  return coolifyFetch<VersionResponse>("/version", {
    isText: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
