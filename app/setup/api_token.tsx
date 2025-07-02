import SetupScreenContainer from "@/components/SetupScreenContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import useSetup from "@/hooks/useSetup";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";

export default function ApiTokenStep() {
  const setup = useSetup();

  const [token, setToken] = useState("");
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

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
      Alert.alert("Please set a token");
    }
  };

  useEffect(() => {
    setValid(token.trim() !== "");
    setError(undefined);
  }, [token]);

  return (
    <SetupScreenContainer>
      <Text>Enter your Coolify API Token</Text>
      <Input
        autoCapitalize="none"
        autoComplete="off"
        enterKeyHint="done"
        onChangeText={setToken}
        onSubmitEditing={saveKey}
        value={token}
        placeholder="API TOKEN"
        enablesReturnKeyAutomatically
        secureTextEntry
      />
      <Button onPress={saveKey} disabled={!valid} loading={loading}>
        <Text>Save</Text>
      </Button>
      <Text className="color-red-500">{error}</Text>
    </SetupScreenContainer>
  );
}
