import { ChevronRight } from "@/components/icons/ChevronRight";
import { Code } from "@/components/icons/Code";
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
    <Link href={href as any} className="py-6">
      <View className="flex flex-row items-center justify-between w-full">
        <View className="flex flex-row items-center gap-3">
          {icon}
          <Text className="text-lg">{label}</Text>
        </View>
        <ChevronRight className="text-primary" />
      </View>
    </Link>
  );
}

export default function ApplicationSettingsIndex() {
  return (
    <ScrollView className="p-6 gap-4">
      <H1>Settings</H1>
      <SettingsLink
        icon={<Code className="text-primary" />}
        href="./settings/environments"
        label="Environment Variables"
      />
    </ScrollView>
  );
}
