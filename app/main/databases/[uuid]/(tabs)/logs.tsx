import { SafeView } from "@/components/SafeView";
import { Text } from "@/components/ui/text";

// TODO: Add logs for databases
export default function DatabaseLogs() {
  return (
    <SafeView
      topInset
      bottomInset={false}
      className="flex-1 items-center justify-center"
    >
      <Text className="text-muted-foreground">
        Logs are not available for databases
      </Text>
      <Text className="text-muted-foreground">
        This is a limitation of the API.
      </Text>
    </SafeView>
  );
}
