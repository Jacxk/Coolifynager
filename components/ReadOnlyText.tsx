import { Text } from "@/components/ui/text";
import useDashboardUrl from "@/hooks/useDashboardUrl";
import { openBrowserAsync } from "expo-web-browser";

export default function ReadOnlyText() {
  const dashboardUrl = useDashboardUrl();

  return (
    <Text className="text-muted-foreground text-sm italic">
      *This field is read-only. You can only change it by navigating to your{" "}
      <Text
        className="underline text-sm"
        onPress={() => dashboardUrl && openBrowserAsync(dashboardUrl)}
      >
        instance dashboard
      </Text>
      .
    </Text>
  );
}
