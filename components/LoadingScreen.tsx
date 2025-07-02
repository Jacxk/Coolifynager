import { ActivityIndicator, View } from "react-native";
import { Text } from "./ui/text";

export default function LoadingScreen() {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#888" />
      <Text style={{ marginTop: 16, fontSize: 16, color: "#888" }}>
        Loading...
      </Text>
    </View>
  );
}
