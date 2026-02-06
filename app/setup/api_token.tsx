import InfoDialog from "@/components/InfoDialog";
import SetupScreenContainer from "@/components/SetupScreenContainer";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { APP_NAME } from "@/constants/AppDetails";
import useSetup from "@/hooks/useSetup";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import React, { useState } from "react";
import { Alert as NativeAlert, View } from "react-native";

export default function ApiTokenStep() {
  const { reconfigure, redirect } = useLocalSearchParams<{
    reconfigure: string;
    redirect: RelativePathString;
  }>();
  const { setApiToken, serverAddress, setupComplete } = useSetup();

  const [token, setToken] = useState("");
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const navigate = () => {
    if (reconfigure) {
      router.dismissTo(redirect ?? "/main/settings");
    } else {
      router.navigate("/setup/permissions");
    }
  };

  const saveKey = () => {
    if (valid) {
      setLoading(true);
      setApiToken(token)
        .then(() => setError(undefined))
        .then(() => navigate())
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    } else {
      NativeAlert.alert("Please set a token");
    }
  };

  const openBrowser = () => {
    openBrowserAsync(`${serverAddress}/security/api-tokens`);
  };

  const onChangeToken = (text: string) => {
    setValid(text.trim() !== "");
    setError(undefined);
    setToken(text);
  };

  return (
    <SetupScreenContainer>
      <View className="flex-row items-center mb-1">
        <Text className="text-white text-lg">Enter your Coolify API Token</Text>
        <InfoDialog
          title="How to generate an API Token"
          description={`To connect ${APP_NAME} to your Coolify instance, you need to generate an API token:`}
          triggerAccessibilityLabel="API Token Info"
        >
          <View className="pl-2">
            <Text className="text-white/80">
              1. Open your{" "}
              <Text
                className="underline font-semibold text-yellow-400"
                onPress={openBrowser}
              >
                Coolify dashboard
              </Text>
              .
            </Text>
            <Text className="text-white/80">
              2. Go to{" "}
              <Text className="font-semibold text-yellow-400">
                Keys & Tokens {">"} API tokens
              </Text>
              .
            </Text>
            <Text className="text-white/80">
              3. Create a new token with the following permissions:
            </Text>
            <View className="pl-4">
              <Text className="text-white/80">• read</Text>
              <Text className="text-white/80">• read:sensitive</Text>
              <Text className="text-white/80">• write</Text>
              <Text className="text-white/80">• deploy</Text>
            </View>
          </View>
        </InfoDialog>
      </View>
      <PasswordInput
        enterKeyHint="done"
        onChangeText={onChangeToken}
        onSubmitEditing={saveKey}
        value={token}
        placeholder="API TOKEN"
        enablesReturnKeyAutomatically
      />
      <Button
        onPress={saveKey}
        disabled={!valid}
        loading={loading}
        className="bg-white"
      >
        <Text className="text-black">Save</Text>
      </Button>
      {setupComplete && (
        <Button onPress={navigate} variant="ghost">
          <Text>Skip</Text>
        </Button>
      )}
      {!!error && <Text className="text-red-400">{error}</Text>}
    </SetupScreenContainer>
  );
}
