import { Text } from "@/components/ui/text";

// TODO: Add logs for services
import { View } from "react-native";
export default function ServiceLogs() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-muted-foreground">
        Logs are not available for services.
      </Text>
      <Text className="text-muted-foreground">
        This is a limitation of the API.
      </Text>
    </View>
  );
}
