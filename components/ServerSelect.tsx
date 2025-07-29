import { useServers } from "@/api/servers";
import useStorage from "@/hooks/useStorage";
import { useEffect } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Text } from "./ui/text";

type ServerSelectProps = {
  displayLabel?: boolean;
  label?: string;
};

export default function ServerSelect({
  displayLabel = true,
  label = "Server",
}: ServerSelectProps) {
  const insets = useSafeAreaInsets();
  const { data: servers, refetch } = useServers();
  const { server, setServer } = useStorage({});

  useEffect(() => {
    if (!server) {
      setServer({
        name: servers?.[0]?.name ?? "",
        uuid: servers?.[0]?.uuid ?? "",
      });
    }
  }, []);

  if (!servers || !server) return null;

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const defaultServer = {
    label: server.name,
    value: server.uuid,
  };

  return (
    <View className="gap-2">
      {displayLabel && (
        <Text className="text-muted-foreground" nativeID="server-label">
          {label}
        </Text>
      )}
      <Select
        onValueChange={(option) => {
          setServer({
            name: option?.label ?? "",
            uuid: option?.value ?? "",
          });
        }}
        defaultValue={defaultServer}
        onOpenChange={(open) => {
          if (open) refetch();
        }}
      >
        <SelectTrigger nativeID="server-select">
          <SelectValue
            className="text-foreground"
            placeholder="Select a server"
          />
        </SelectTrigger>
        <SelectContent insets={contentInsets}>
          <SelectLabel>Select a Server</SelectLabel>
          <SelectSeparator />
          {servers?.map((server) => (
            <SelectItem
              key={server.uuid}
              value={server.uuid}
              label={server.name}
            >
              {server.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </View>
  );
}
