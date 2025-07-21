import { SSLMode } from "@/api/types/database.types";
import InfoDialog from "@/components/InfoDialog";
import ReadOnlyText from "@/components/ReadOnlyText";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";
import { View } from "react-native";

export default function SslConfigurationSection({
  enable_ssl,
  ssl_mode,
}: {
  enable_ssl: boolean;
  ssl_mode: SSLMode;
}) {
  const sslMode =
    ssl_mode + (ssl_mode === SSLMode.ALLOW ? " (insecure)" : " (secure)");

  return (
    <View className="gap-2">
      <H3>SSL Configuration</H3>
      <View className="flex-1 gap-4 flex-row">
        <Checkbox checked={enable_ssl} onCheckedChange={() => {}}>
          <CheckboxLabel asChild>
            <InfoDialog
              label="Enable SSL"
              description={
                <View className="gap-2">
                  <Text className="text-muted-foreground">
                    Database should be stopped to change this settings.
                  </Text>
                  <ReadOnlyText />
                </View>
              }
            />
          </CheckboxLabel>
          <CheckboxIcon />
        </Checkbox>
      </View>
      <View className="flex-1 gap-1">
        <InfoDialog
          label="SSL Mode"
          description={
            <View className="gap-2">
              <Text className="text-muted-foreground">
                Database should be stopped to change this settings.
              </Text>
              <ReadOnlyText />
            </View>
          }
        />
        <Input value={sslMode} editable={false} />
      </View>
    </View>
  );
}
