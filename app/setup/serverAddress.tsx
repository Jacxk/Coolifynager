import Button from "@/components/ui/Button";
import useSetup from "@/hooks/useSetup";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput
} from "react-native";

export default function ServerStep() {
  const coolify = useSetup();

  const [server, setServer] = useState("");
  const [valid, setValid] = useState(false);

  const saveServerAddress = async () => {
    if (valid) {
      await coolify.setServerAddress(server);
      router.navigate("/setup/apikey")
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
    coolify.getServerAddress().then((server) => setServer(server ?? ""))
  }, [])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.paragraph}>Enter your Coolify instance URL</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={setServer}
        value={server}
        placeholder="http://localhost:8000"
        autoCapitalize="none"
      />
      <Button onPress={saveServerAddress} disabled={!valid}>
        Continue
      </Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 8,
    gap: 8,
  },
  paragraph: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  textInput: {
    height: 35,
    borderColor: "gray",
    borderRadius: 8,
    borderWidth: 1,
    padding: 6,
  },
});
