import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import useServerStatus from "@/hooks/useServerStatus";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { toast } from "sonner-native";

export default function ServerUnreachable() {
  const router = useRouter();
  const { refetch } = useServerStatus();
  const [retrying, setRetrying] = useState(false);

  const handleRetry = useCallback(async () => {
    setRetrying(true);
    try {
      const result = await refetch();

      if (result.data !== "OK") {
        toast.error(
          "Server still unreachable. Please check your connection or configuration.",
        );
      } else {
        router.replace("/main");
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
          onPress={() =>
            router.push({
              pathname: "/setup/serverAddress",
              params: {
                reconfigure: "true",
                redirect: "/main",
              },
            })
          }
          disabled={retrying}
        >
          <Text>Reconfigure</Text>
        </Button>
      </View>
    </View>
  );
}
