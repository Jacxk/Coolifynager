import { cn } from "@/lib/utils";
import { ActivityIndicator, View } from "react-native";
import { Text } from "./ui/text";

export default function LoadingScreen({ className }: { className?: string }) {
  return (
    <View className={cn("flex-1 justify-center items-center", className)}>
      <ActivityIndicator className="color-muted-foreground" size="large" />
      <Text className="mt-4 text-base text-muted-foreground">Loading...</Text>
    </View>
  );
}
