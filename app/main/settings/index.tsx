import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
import {
  SettingsButton,
  SettingsButtonProps,
} from "@/components/SettingsButton";
import { SettingsLink, SettingsLinkProps } from "@/components/SettingsLink";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FlatList, Linking } from "react-native";
import { Switch } from "react-native-gesture-handler";

type SettingsItem =
  | (SettingsLinkProps & { isLink: true })
  | (SettingsButtonProps & { isLink: false });

export default function Settings() {
  const { toggleColorScheme, isDarkColorScheme } = useColorScheme();

  const data: SettingsItem[] = [
    {
      label: "Dark Mode",
      isLink: false,
      onPress: toggleColorScheme,
      icon: null,
      rightComponent: (
        <Switch value={isDarkColorScheme} onValueChange={toggleColorScheme} />
      ),
    },
    {
      label: "Reconfigure Linked Instance",
      isLink: true,
      href: "/setup/serverAddress",
      icon: null,
      description:
        "Change the server address and/or the API key of the current linked instance.",
    },
    {
      isLink: false,
      label: "Share Feedback",
      onPress: () => {
        Linking.openURL("https://github.com/Jacxk/Coolifynager/issues");
      },
      rightComponent: <ArrowUpRight />,
    },
  ];

  return (
    <FlatList
      className="p-4"
      data={data}
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
