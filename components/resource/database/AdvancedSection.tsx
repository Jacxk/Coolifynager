import InfoDialog from "@/components/InfoDialog";
import ReadOnlyText from "@/components/ReadOnlyText";
import { Checkbox } from "@/components/ui/checkbox";
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";
import { View } from "react-native";

export default function AdvancedSection({
  is_log_drain_enabled,
}: {
  is_log_drain_enabled: boolean;
}) {
  return (
    <View className="gap-2">
      <H3>Advanced</H3>
      <View className="flex-1 gap-4 flex-row">
        <InfoDialog
          label="Drain Logs"
          description={
            <View className="gap-2">
              <Text className="text-muted-foreground">
                Drain logs to your configured log drain endpoint in your Server
                settings.
              </Text>
              <ReadOnlyText />
            </View>
          }
        />
        <Checkbox
          disabled
          checked={is_log_drain_enabled}
          onCheckedChange={() => {}}
        />
      </View>
    </View>
  );
}
