import { getHealth } from "@/api/status";
import { useQuery } from "@tanstack/react-query";
import useSetup from "./useSetup";

export default function useServerStatus() {
  const { serverAddress } = useSetup();

  const {
    data: health,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["server-status", serverAddress ?? ""],
    queryFn: () => getHealth(serverAddress ?? ""),
    enabled: !!serverAddress,
    retry: false,
    refetchInterval: 60 * 1000,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: true,
  });

  if (!serverAddress) {
    return { healthy: null, refetch };
  }

  if (isLoading) {
    return { healthy: null, refetch };
  }

  if (isError || health !== "OK") {
    return { healthy: false, refetch };
  }

  return { healthy: true, refetch };
}
