import { getApplicationEnvs } from "@/api/application";
import { ChevronRight } from "@/components/icons/ChevronRight";
import { Code } from "@/components/icons/Code";
import { TriangleAlert } from "@/components/icons/TriangleAlert";
import { SafeView } from "@/components/SafeView";
import { Text } from "@/components/ui/text";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useGlobalSearchParams } from "expo-router";
import { useEffect } from "react";
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
  const { uuid } = useGlobalSearchParams<{ uuid: string }>();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery(getApplicationEnvs(uuid));
  }, [uuid]);

  return (
    <SafeView bottomInset={false}>
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
