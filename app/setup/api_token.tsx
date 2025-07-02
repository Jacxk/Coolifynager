import SetupScreenContainer from "@/components/SetupScreenContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import useSetup from "@/hooks/useSetup";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";

export default function ApiTokenStep() {
  const setup = useSetup();

  const [token, setToken] = useState("");
  const [valid, setValid] = useState(false);

  const saveKey = () => {
    if (valid) {
      setup.setApiToken(token).catch(console.error);
    } else {
      Alert.alert("Please set a token");
    }
  };

  useEffect(() => {
    setValid(token.trim() !== "");
  }, [token]);

  return (
    <SetupScreenContainer>
      <Text>Enter your Coolify API Token</Text>
      <Input
        autoCapitalize="none"
        onChangeText={setToken}
        value={token}
        placeholder="API TOKEN"
      />
      <Button onPress={saveKey} disabled={!valid}>
        <Text>Save</Text>
      </Button>
    </SetupScreenContainer>
  );
}
