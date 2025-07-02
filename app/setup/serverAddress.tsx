import SetupScreenContainer from "@/components/SetupScreenContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import useSetup from "@/hooks/useSetup";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";

export default function ServerStep() {
  const setup = useSetup();

  const [server, setServer] = useState("");
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const saveServerAddress = async () => {
    if (valid) {
      setLoading(true);
      setup
        .setServerAddress(server)
        .then(() => setError(undefined))
        .then(() => router.navigate("/setup/api_token"))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    } else {
      Alert.alert("Please set a server");
    }
  };

  useEffect(() => {
    try {
      new URL(server.trim());
      setValid(true);
    } catch {
      setValid(false);
    }

    setError(undefined);
  }, [server]);

  useEffect(() => {
    setup.getServerAddress().then((s) => setServer(s ?? server ?? ""));
  }, []);

  return (
    <SetupScreenContainer>
      <Text>Enter your Coolify instance URL</Text>
      <Input
        onChangeText={setServer}
        onSubmitEditing={saveServerAddress}
        value={server}
        placeholder="http://localhost:8000"
        autoCapitalize="none"
        autoComplete="off"
        keyboardType="url"
        enterKeyHint="next"
        enablesReturnKeyAutomatically
      />
      <Button onPress={saveServerAddress} disabled={!valid} loading={loading}>
        <Text>Continue</Text>
      </Button>
      <Text className="color-red-500">{error}</Text>
    </SetupScreenContainer>
  );
}
