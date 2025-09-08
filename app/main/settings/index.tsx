import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
import Info from "@/components/icons/Info";
import { MessageCircle } from "@/components/icons/MessageCircle";
import { Moon } from "@/components/icons/Moon";
import { Server } from "@/components/icons/Server";
import { Trash2 } from "@/components/icons/Trash2";
import {
  SettingsButton,
  SettingsButtonProps,
} from "@/components/SettingsButton";
import { SettingsLink, SettingsLinkProps } from "@/components/SettingsLink";
import { H3 } from "@/components/ui/typography";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Linking, SectionList, View } from "react-native";
import { Switch } from "react-native-gesture-handler";

type SettingsItem =
  | (SettingsLinkProps & { isLink: true })
  | (SettingsButtonProps & { isLink: false });

type SettingsSections = {
  title: string;
  data: SettingsItem[];
};

export default function Settings() {
  const { toggleColorScheme, isDarkColorScheme } = useColorScheme();

  const appearanceItems: SettingsItem[] = [
    {
      label: "Dark Mode",
      isLink: false,
      onPress: toggleColorScheme,
      icon: <Moon />,
      rightComponent: (
        <Switch value={isDarkColorScheme} onValueChange={toggleColorScheme} />
      ),
    },
  ];

  const appConfigItems: SettingsItem[] = [
    {
      label: "Reconfigure Linked Instance",
      isLink: true,
      href: "/setup",
      icon: <Server />,
      description:
        "Change the server address and/or the API key of the current linked instance.",
    },
    {
      label: "Clear Cache",
      labelClassName: "text-destructive",
      isLink: false,
      onPress: () => {
        // TODO: Clear cache
      },
      icon: <Trash2 className="text-destructive" />,
    },
  ];

  const appInfoItems: SettingsItem[] = [
    {
      label: "Share Feedback",
      isLink: false,
      onPress: () => {
        Linking.openURL("https://github.com/Jacxk/Coolifynager/issues");
      },
      icon: <MessageCircle />,
      rightComponent: <ArrowUpRight />,
    },
    {
      label: "About",
      isLink: true,
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
        if (item.isLink) {
          return <SettingsLink {...item} />;
        } else {
          return <SettingsButton {...item} />;
        }
      }}
    />
  );
}
