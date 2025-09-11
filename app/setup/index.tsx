import { Button } from "@/components/ui/button";
import { H1, Lead, P } from "@/components/ui/typography";
import { APP_DESCRIPTION, APP_ICON, APP_NAME } from "@/constants/AppDetails";
import useSetup from "@/hooks/useSetup";
import { router } from "expo-router";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SetupIndex() {
  const setup = useSetup();

  const handleGetStarted = () => {
    setup.isSetupComplete().then((complete) => {
      const route = complete ? "/setup/serverAddress" : "/setup/permissions";
      router.push(route);
    });
  };

  const insets = useSafeAreaInsets();
  const contentInsets = {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: 12,
    paddingRight: 12,
  };

  return (
    <View className="flex-1 bg-branding" style={contentInsets}>
      <View className="flex-1 justify-center">
        <View className="items-center">
          <Image
            source={APP_ICON}
            className="w-20 h-20 rounded-2xl mb-4"
            resizeMode="contain"
          />
          <H1 className="text-center mb-2 text-white">{APP_NAME}</H1>
          <Lead className="text-center text-white/80">{APP_DESCRIPTION}</Lead>
        </View>

        <View>
          <P className="text-center text-sm text-white/70 mb-4">
            Real-time monitoring • Project Management • Application Control
          </P>
        </View>
      </View>

      <View>
        <Button
          onPress={handleGetStarted}
          size="lg"
          className="w-full bg-white"
        >
          <P className="text-black font-semibold">Get Started</P>
        </Button>
        <P className="text-center text-xs text-white/60 mt-3">
          {APP_NAME} is an independent project and is not affiliated with,
          endorsed by, or sponsored by Coolify or its creators.
        </P>
      </View>
    </View>
  );
}
