import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import useSetup from "@/hooks/useSetup";
import { View } from "react-native";

export default function Index() {
  const setup = useSetup();

  return (
    <View className="p-8">
      <Text>App index</Text>
      <Button
        onPress={() => {
          setup.resetSetup();
        }}
      >
        <Text>Reset</Text>
      </Button>
    </View>
  );
}
