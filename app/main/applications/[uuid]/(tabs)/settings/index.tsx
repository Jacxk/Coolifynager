import { ChevronRight } from "@/components/icons/ChevronRight";
import { Code } from "@/components/icons/Code";
import { TriangleAlert } from "@/components/icons/TriangleAlert";
import { SafeView } from "@/components/SafeView";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { Link } from "expo-router";
import { ScrollView, View } from "react-native";

function SettingsLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link href={href as any} className="py-4">
      <View className="flex flex-row items-center justify-between w-full">
        <View className="flex flex-row items-center gap-3">
          {icon}
          <Text className="text-lg">{label}</Text>
        </View>
        <ChevronRight />
      </View>
    </Link>
  );
}

export default function ApplicationSettingsIndex() {
  return (
    <SafeView>
      <H1>Settings</H1>
      <ScrollView>
        <SettingsLink
          icon={<Code />}
          href="./settings/environments"
          label="Environment Variables"
        />
        <SettingsLink
          icon={<TriangleAlert />}
          href="./settings/danger"
          label="Danger Zone"
        />
      </ScrollView>
    </SafeView>
  );
}
