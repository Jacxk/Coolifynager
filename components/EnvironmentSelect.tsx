import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Option } from "@rn-primitives/select";
import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type Environment = {
  uuid: string;
  name: string;
};

interface EnvironmentSelectProps {
  environments: { uuid: string; name: string }[];
  defaultEnvironment: Environment;
  onSelect: (env: Environment) => void;
}

export default function EnvironmentSelect({
  environments,
  defaultEnvironment,
  onSelect,
}: EnvironmentSelectProps) {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const [selectedEnvironment, setSelectedEnvironment] = useState<Option>({
    label: defaultEnvironment.name,
    value: defaultEnvironment.uuid,
  });

  return (
    <View>
      <Label nativeID="environment-label">Environment</Label>
      <Select
        onValueChange={(option) => {
          setSelectedEnvironment(option);
          onSelect({
            name: option?.label ?? "",
            uuid: option?.value ?? "",
          });
        }}
        value={selectedEnvironment}
      >
        <SelectTrigger nativeID="environment-select">
          <SelectValue
            className="text-foreground"
            placeholder="Select an environment"
          />
        </SelectTrigger>
        <SelectContent insets={contentInsets}>
          <SelectLabel>Select an Environment</SelectLabel>
          <SelectSeparator />
          {environments.map((env) => (
            <SelectItem key={env.uuid} value={env.uuid} label={env.name} />
          ))}
        </SelectContent>
      </Select>
    </View>
  );
}
