import SetupScreenContainer from "@/components/SetupScreenContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import useSetup from "@/hooks/useSetup";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";

export default function ServerStep() {
  const { reconfigure } = useLocalSearchParams<{ reconfigure: string }>();
  const { setServerAddress, serverAddress } = useSetup();

  const [server, setServer] = useState("");
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const saveServerAddress = async () => {
    if (valid) {
      setLoading(true);
      setServerAddress(server)
        .then(() => setError(undefined))
        .then(() =>
          router.navigate({
            pathname: "/setup/api_token",
            params: { reconfigure },
          }),
        )
        .catch((error: Error) => setError(error.message))
        .finally(() => setLoading(false));
    } else {
      Alert.alert("Please set a server");
    }
  };

  const onChangeServer = (text: string) => {
    try {
      new URL(text.trim());
      setValid(true);
    } catch {
      setValid(false);
      setError("Invalid URL");
    }

    setError(undefined);
    setServer(text);
  };

  useEffect(() => {
    if (serverAddress) {
      onChangeServer(serverAddress);
    }
  }, [serverAddress]);

  return (
    <SetupScreenContainer>
      <Text className="text-white text-lg">
        Enter your Coolify instance URL
      </Text>
      <Input
        onChangeText={onChangeServer}
        onSubmitEditing={saveServerAddress}
        value={server}
        placeholder="http://localhost:8000"
        autoCapitalize="none"
        autoComplete="off"
        keyboardType="url"
        enterKeyHint="next"
        enablesReturnKeyAutomatically
      />
      <Button
        onPress={saveServerAddress}
        disabled={!valid}
        loading={loading}
        className="bg-white"
      >
        <Text className="text-black">Continue</Text>
      </Button>
      {error && <Text className="text-red-400">{error}</Text>}
    </SetupScreenContainer>
  );
}
