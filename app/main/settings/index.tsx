import { useTeams } from "@/api/teams";
import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
import Info from "@/components/icons/Info";
import { MessageCircle } from "@/components/icons/MessageCircle";
import { Moon } from "@/components/icons/Moon";
import { RotateCw } from "@/components/icons/RotateCw";
import { Server } from "@/components/icons/Server";
import { Trash2 } from "@/components/icons/Trash2";
import {
  SettingsButton,
  SettingsButtonProps,
} from "@/components/SettingsButton";
import { SettingsLink, SettingsLinkProps } from "@/components/SettingsLink";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { H3 } from "@/components/ui/typography";
import { LOG_REFETCH_INTERVAL_STORAGE_KEY } from "@/constants/StorageKeys";
import { useColorScheme } from "@/hooks/useColorScheme";
import useSetup from "@/hooks/useSetup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Linking, SectionList, View } from "react-native";
import { Switch } from "react-native-gesture-handler";

type SettingsItem =
  | SettingsLinkProps
  | SettingsButtonProps
  | { label: string; render: React.ReactElement | null };

type SettingsSections = {
  title: string;
  data: SettingsItem[];
};

function TeamSelect() {
  const { team, setTeam } = useSetup();
  const { data: teams } = useTeams();

  if (!teams || !team) return null;

  const selectedTeam = {
    value: team,
    label: teams.find((t) => t.id.toString() === team)?.name ?? team,
  };

  return (
    <View>
      <Label nativeID="team-label">Team Selection</Label>
      <Select
        onValueChange={(team) => team && setTeam(team.value)}
        value={selectedTeam}
      >
        <SelectTrigger>
          <SelectValue
            className="text-foreground"
            placeholder="Select a team"
          />
        </SelectTrigger>
        <SelectContent>
          {teams.map((team) => (
            <SelectItem
              key={team.id}
              value={team.id.toString()}
              label={team.name}
            />
          ))}
        </SelectContent>
      </Select>
    </View>
  );
}

export default function Settings() {
  const { toggleColorScheme, isDarkColorScheme } = useColorScheme();

  const appearanceItems: SettingsItem[] = [
    {
      label: "Dark Mode",
      onPress: toggleColorScheme,
      icon: <Moon />,
      rightComponent: (
        <Switch value={isDarkColorScheme} onValueChange={toggleColorScheme} />
      ),
    },
  ];

  const appConfigItems: SettingsItem[] = [
    {
      label: "Team Selection",
      render: <TeamSelect />,
    },
    {
      label: "Reconfigure Linked Instance",
      href: {
        pathname: "/setup/serverAddress",
        params: { reconfigure: "true" },
      },
      icon: <Server />,
      description:
        "Change the server address and/or the API key of the current linked instance.",
    },
    {
      label: "Logs Refetch Interval",
      onPress: async () => {
        const savedInterval = await AsyncStorage.getItem(
          LOG_REFETCH_INTERVAL_STORAGE_KEY,
        );
        Alert.prompt(
          "Logs Refetch Interval",
          "Enter the logs refetch interval in milliseconds, do not go too low as it will cause performance issues. The default is 2000ms.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              isPreferred: true,
              text: "Save",
              onPress: (text: string | undefined) => {
                AsyncStorage.setItem(
                  LOG_REFETCH_INTERVAL_STORAGE_KEY,
                  text || "2000",
                );
              },
            },
          ],
          "plain-text",
          savedInterval ?? "2000",
          "numeric",
        );
      },
      icon: <RotateCw />,
    },
    {
      label: "Clear Cache",
      labelClassName: "text-destructive",
      onPress: () => {
        // TODO: Clear cache
      },
      icon: <Trash2 className="text-destructive" />,
    },
  ];

  const appInfoItems: SettingsItem[] = [
    {
      label: "Share Feedback",
      onPress: () => {
        Linking.openURL("https://github.com/Jacxk/Coolifynager/issues");
      },
      icon: <MessageCircle />,
      rightComponent: <ArrowUpRight />,
    },
    {
      label: "About",
      href: "/main/settings/about",
      icon: <Info />,
    },
  ];

  const sections: SettingsSections[] = [
    {
      title: "Appearance",
      data: appearanceItems,
    },
    {
      title: "Info and Feedback",
      data: appInfoItems,
    },
    {
      title: "Configuration",
      data: appConfigItems,
    },
  ];

  return (
    <SectionList
      className="p-4"
      sections={sections}
      keyExtractor={(item) => item.label}
      ItemSeparatorComponent={() => <View className="h-[.3px] bg-muted mx-4" />}
      renderSectionHeader={({ section: { title } }) => (
        <H3 className="my-4">{title}</H3>
      )}
      renderItem={({ item }) => {
        if ("render" in item) {
          return item.render ?? null;
        } else if ("href" in item) {
          return <SettingsLink {...item} />;
        } else {
          return <SettingsButton {...item} />;
        }
      }}
    />
  );
}
