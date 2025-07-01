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

  const saveServerAddress = async () => {
    if (valid) {
      await setup.setServerAddress(server);
      router.navigate("/setup/apikey");
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
  }, [server]);

  useEffect(() => {
    setup.getServerAddress().then((server) => setServer(server ?? ""));
  }, []);

  return (
    <SetupScreenContainer>
      <Text>Enter your Coolify instance URL</Text>
      <Input
        onChangeText={setServer}
        value={server}
        placeholder="http://localhost:8000"
        autoCapitalize="none"
      />
      <Button onPress={saveServerAddress} disabled={!valid}>
        <Text>Continue</Text>
      </Button>
    </SetupScreenContainer>
  );
}
