import { UpdateApplicationBody } from "@/api/types/application.types";
import InfoDialog from "@/components/InfoDialog";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { Control, Controller } from "react-hook-form";
import { View } from "react-native";

export function PortsExposesController({ control }: { control: Control<any> }) {
  return (
    <Controller
      control={control}
      name="ports_exposes"
      rules={{
        pattern: {
          value: /^(\d+)(,\d+)*$/,
          message:
            "Invalid ports exposes. Use comma separated numbers (e.g. 80,443)",
        },
      }}
      render={({ field: { onChange, value, onBlur }, fieldState: { isDirty } }) => (
        <View className="gap-1">
          <InfoDialog
            label="Ports Exposes"
            description="A comma separated list of ports your application uses. The first port will be used as default healthcheck port if nothing defined in the Healthcheck menu. Be sure to set this correctly."
          />
          <Input
            className={cn({
              "border-yellow-500": isDirty,
            })}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            keyboardType="numbers-and-punctuation"
            placeholder="3000,3001"
          />
        </View>
      )}
    />
  );
}

export default function NetworkSection({
  control,
}: {
  control: Control<UpdateApplicationBody>;
}) {
  return (
    <View className="gap-2">
      <H3>Network</H3>
      <PortsExposesController control={control} />
      <View className="gap-1">
        <InfoDialog
          label="Ports Mappings"
          description={
            <View className="gap-2">
              <Text className="text-muted-foreground">
                A comma separated list of ports you would like to map to the
                host system. Useful when you do not want to use domains.
              </Text>
              <View>
                <Text className="text-yellow-500 font-bold">Example</Text>
                <Text className="text-muted-foreground">
                  3000:3000,3002:3002
                </Text>
              </View>
              <Text className="text-muted-foreground">
                Rolling update is not supported if you have a port mapped to the
                host.
              </Text>
            </View>
          }
        />
        <Controller
          control={control}
          name="ports_mappings"
          render={({ field: { onChange, value, onBlur }, fieldState: { isDirty } }) => (
            <Input
              className={cn({
                "border-yellow-500": isDirty,
              })}
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              keyboardType="numbers-and-punctuation"
              placeholder="3000:3000"
            />
          )}
        />
      </View>

      <View className="gap-1">
        <InfoDialog
          label="Network Aliases"
          description={
            <View className="gap-2">
              <Text className="text-muted-foreground">
                A comma separated list of custom network aliases you would like
                to add for container in Docker network.
              </Text>
              <View>
                <Text className="text-yellow-500 font-bold">Example</Text>
                <Text className="text-muted-foreground">
                  api.internal,api.local
                </Text>
              </View>
            </View>
          }
        />
        <Controller
          control={control}
          name="custom_network_aliases"
          render={({ field: { onChange, value, onBlur }, fieldState: { isDirty } }) => (
            <Input
              className={cn({
                "border-yellow-500": isDirty,
              })}
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
      </View>
    </View>
  );
}
