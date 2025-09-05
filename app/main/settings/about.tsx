import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
import { Globe } from "@/components/icons/Globe";
import { MessageCircle } from "@/components/icons/MessageCircle";
import { Server } from "@/components/icons/Server";
import {
  SettingsButton,
  SettingsButtonProps,
} from "@/components/SettingsButton";
import { Text } from "@/components/ui/text";
import { H2, H3 } from "@/components/ui/typography";
import {
  APP_BUILD_VERSION,
  APP_DESCRIPTION,
  APP_ICON,
  APP_NAME,
  APP_VERSION,
} from "@/constants/AppDetails";
import { Image, Linking, ScrollView, View } from "react-native";

type AboutItem = SettingsButtonProps;

export default function About() {
  const appInfoItems: AboutItem[] = [
    {
      label: "App Name",
      rightComponent: <Text className="text-muted-foreground">{APP_NAME}</Text>,
    },
    {
      label: "Version",
      rightComponent: (
        <Text className="text-muted-foreground">{APP_VERSION}</Text>
      ),
    },
    {
      label: "Build",
      rightComponent: (
        <Text className="text-muted-foreground">{APP_BUILD_VERSION}</Text>
      ),
    },
  ];

  const linksItems: AboutItem[] = [
    {
      label: "GitHub Repository",
      onPress: () => {
        Linking.openURL("https://github.com/Jacxk/Coolifynager");
      },
      icon: <Server />,
      rightComponent: <ArrowUpRight />,
    },
    {
      label: "Report Issues",
      onPress: () => {
        Linking.openURL("https://github.com/Jacxk/Coolifynager/issues");
      },
      icon: <MessageCircle />,
      rightComponent: <ArrowUpRight />,
    },
    {
      label: "Coolify Documentation",
      onPress: () => {
        Linking.openURL("https://coolify.io/docs");
      },
      icon: <Globe />,
      rightComponent: <ArrowUpRight />,
    },
    {
      label: "Coolify Website",
      onPress: () => {
        Linking.openURL("https://coolify.io");
      },
      icon: <Globe />,
      rightComponent: <ArrowUpRight />,
    },
  ];

  const technicalItems: AboutItem[] = [
    {
      label: "Framework",
      rightComponent: (
        <Text className="text-muted-foreground">Expo + React Native</Text>
      ),
    },
    {
      label: "Platform",
      rightComponent: (
        <Text className="text-muted-foreground">iOS, Android, Web</Text>
      ),
    },
    {
      label: "Styling",
      rightComponent: (
        <Text className="text-muted-foreground">NativeWind (Tailwind CSS)</Text>
      ),
    },
  ];

  const features = [
    "View and manage Coolify applications, services, databases, and projects",
    "Monitor and control applications, services, and databases",
    "Intuitive, mobile-first interface",
    "Dark mode support",
    "Real-time deployment monitoring",
    "Favorites system for quick access",
  ];

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* App Header */}
        <View className="items-center mb-8">
          <Image
            source={APP_ICON}
            className="w-20 h-20 rounded-2xl items-center justify-center mb-4"
          />
          <H2 className="text-center mb-2">{APP_NAME}</H2>
          <Text className="text-muted-foreground text-center text-base">
            {APP_DESCRIPTION}
          </Text>
        </View>

        {/* App Information */}
        <View className="mb-6">
          <H3 className="mb-4">App Information</H3>
          <View className="bg-card rounded-lg border">
            {appInfoItems.map((item, index) => (
              <View key={item.label}>
                <SettingsButton {...item} pressable={false} />
                {index < appInfoItems.length - 1 && (
                  <View className="h-[.3px] bg-muted mx-4" />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Features */}
        <View className="mb-6">
          <H3 className="mb-4">Features</H3>
          <View className="bg-card rounded-lg border p-4">
            {features.map((feature, index) => (
              <View key={feature} className="flex-row items-start mb-2">
                <Text className="text-primary mr-2">•</Text>
                <Text className="flex-1 text-sm">{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Technical Information */}
        <View className="mb-6">
          <H3 className="mb-4">Technical Information</H3>
          <View className="bg-card rounded-lg border">
            {technicalItems.map((item, index) => (
              <View key={item.label}>
                <SettingsButton {...item} pressable={false} />
                {index < technicalItems.length - 1 && (
                  <View className="h-[.3px] bg-muted mx-4" />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Links */}
        <View className="mb-6">
          <H3 className="mb-4">Links & Resources</H3>
          <View className="bg-card rounded-lg border">
            {linksItems.map((item, index) => (
              <View key={item.label}>
                <SettingsButton {...item} />
                {index < linksItems.length - 1 && (
                  <View className="h-[.3px] bg-muted mx-4" />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* License */}
        <View className="mb-6">
          <H3 className="mb-4">License</H3>
          <View className="bg-card rounded-lg border p-4">
            <Text className="text-sm text-muted-foreground">
              This project is licensed under the MIT License. See the{" "}
              <Text
                className="text-primary underline"
                onPress={() =>
                  Linking.openURL(
                    "https://github.com/Jacxk/Coolifynager/blob/main/LICENSE"
                  )
                }
              >
                LICENSE file
              </Text>{" "}
              for details.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center py-4">
          <Text className="text-xs text-muted-foreground text-center">
            Made with ❤️ for the Coolify community
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
