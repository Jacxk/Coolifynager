import SetupScreenContainer from "@/components/SetupScreenContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import useSetup from "@/hooks/useSetup";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";

export default function ApiKeyStep() {
  const setup = useSetup();

  const [key, setKey] = useState("");
  const [valid, setValid] = useState(false);

  const saveKey = () => {
    if (valid) {
      setup.setApiKey(key);
      router.dismissTo("/main");
    } else {
      Alert.alert("Please set a key");
    }
  };

  useEffect(() => {
    setValid(key.trim() !== "");
  }, [key]);

  useEffect(() => {
    setup.getApiKey().then((key) => setKey(key ?? ""));
  }, []);

  return (
    <SetupScreenContainer>
      <Text>Enter your Coolify API key</Text>
      <Input onChangeText={setKey} value={key} placeholder="API Key" />
      <Button onPress={saveKey} disabled={!valid}>
        <Text>Save</Text>
      </Button>
    </SetupScreenContainer>
  );
}
