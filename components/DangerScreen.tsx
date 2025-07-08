import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { SafeView } from "./SafeView";
import { Button } from "./ui/button";
import { H1, H3 } from "./ui/typography";

export default function DangerScreen() {
  return (
    <SafeView className="gap-4">
      <View>
        <H1>Danger Zone</H1>
        <Text className="text-muted-foreground">
          Woah. I hope you know what are you doing.
        </Text>
      </View>
      <View>
        <H3>Delete Resource</H3>
        <Text className="text-muted-foreground">
          This will stop your containers, delete all related data, etc. Beware!
          There is no coming back!
        </Text>
      </View>
      <Button variant="destructive">
        <Text>Delete</Text>
      </Button>
    </SafeView>
  );
}
