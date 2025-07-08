import { SafeView } from "@/components/SafeView";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, H3 } from "@/components/ui/typography";
import { View } from "react-native";

export default function ServiceDangerZone() {
  return (
    <SafeView className="gap-4">
      <View>
        <H1>Danger Zone</H1>
        <Text className="text-muted-foreground">
          Woah. I hope you know what are you doing.
        </Text>
      </View>
      <View>
        <H3>Delete Service</H3>
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
