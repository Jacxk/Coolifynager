import InfoDialog from "@/components/InfoDialog";
import SetupScreenContainer from "@/components/SetupScreenContainer";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { APP_NAME } from "@/constants/AppDetails";
import useSetup from "@/hooks/useSetup";
import { router } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { Alert as NativeAlert, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ApiTokenStep() {
  const setup = useSetup();

  const [token, setToken] = useState("");
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const saveKey = () => {
    if (valid) {
      setLoading(true);
      setup
        .setApiToken(token)
        .then(() => setError(undefined))
        .then(() => router.dismissTo("/main"))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    } else {
      NativeAlert.alert("Please set a token");
    }
  };

  const openBrowser = () => {
    setup
      .getServerAddress()
      .then((url) => openBrowserAsync(`${url}/security/api-tokens`));
  };

  useEffect(() => {
    setValid(token.trim() !== "");
    setError(undefined);
  }, [token]);

  return (
    <SetupScreenContainer>
      <View className="flex-row items-center mb-1">
        <Text>Enter your Coolify API Token</Text>
        <InfoDialog
          title="How to generate an API Token"
          description={`To connect ${APP_NAME} to your Coolify instance, you need to generate an API token:`}
          triggerAccessibilityLabel="API Token Info"
        >
          <View className="pl-2">
            <Text className="text-muted-foreground">
              1. Open your{" "}
              <Text
                className="underline font-semibold text-yellow-500"
                onPress={openBrowser}
              >
                Coolify dashboard
              </Text>
              .
            </Text>
            <Text className="text-muted-foreground">
              2. Go to{" "}
              <Text className="font-semibold text-yellow-500">
                Keys & Tokens {">"} API tokens
              </Text>
              .
            </Text>
            <Text className="text-muted-foreground">
              3. Create a new token with the following permissions:
            </Text>
            <View className="pl-4">
              <Text className="text-muted-foreground">• read</Text>
              <Text className="text-muted-foreground">• read:sensitive</Text>
              <Text className="text-muted-foreground">• write</Text>
              <Text className="text-muted-foreground">• deploy</Text>
            </View>
          </View>
        </InfoDialog>
      </View>
      <PasswordInput
        enterKeyHint="done"
        onChangeText={setToken}
        onSubmitEditing={saveKey}
        value={token}
        placeholder="API TOKEN"
        enablesReturnKeyAutomatically
      />
      <Button onPress={saveKey} disabled={!valid} loading={loading}>
        <Text>Save</Text>
      </Button>
      {!!error && <Text className="color-red-500">{error}</Text>}
    </SetupScreenContainer>
  );
}
