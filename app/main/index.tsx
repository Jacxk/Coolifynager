import Button from "@/components/ui/Button";
import useSetup from "@/hooks/useSetup";
import { Text, View } from "react-native";

export default function Index() {
  const coolify = useSetup();

  return (
    <View style={{ padding: 8 }}>
      <Text>app index</Text>
      <Button
        onPress={() => {
          coolify.resetSetup();
        }}
      >
        Reset
      </Button>
    </View>
  );
}
