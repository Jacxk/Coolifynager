import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import useServerStatus from "@/hooks/useServerStatus";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { toast } from "sonner-native";

export default function ServerUnreachable() {
  const router = useRouter();
  const { refetch } = useServerStatus();
  const queryClient = useQueryClient();
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    queryClient.cancelQueries();
  }, []);

  const handleRetry = useCallback(async () => {
    setRetrying(true);
    try {
      const result = await refetch();
      if (!result.data) {
        toast.error(
          "Server still unreachable. Please check your connection or configuration.",
        );
      } else {
        router.replace("/");
      }
    } finally {
      setRetrying(false);
    }
  }, [refetch, router]);

  return (
    <View className="flex-1 items-center justify-center gap-4 p-6">
      <H1 className="text-center text-lg">Server Unreachable</H1>
      <Text className="text-center text-muted-foreground">
        The server could not be reached. Check your connection and try again.
      </Text>
      <View className="flex-row gap-2">
        <Button
          onPress={handleRetry}
          loading={retrying}
          className="min-w-[120]"
        >
          <Text>Retry</Text>
        </Button>
        <Button
          variant="secondary"
          onPress={() => router.push("/setup/serverAddress")}
          disabled={retrying}
        >
          <Text>Reconfigure</Text>
        </Button>
      </View>
    </View>
  );
}
