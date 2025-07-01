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
  TextInput,
} from "react-native";

export default function ApiKeyStep() {
  const coolify = useSetup();

  const [key, setKey] = useState("");
  const [valid, setValid] = useState(false);

  const saveKey = () => {
    if (valid) {
      coolify.setApiKey(key);
      router.navigate("/main")
    } else {
      Alert.alert("Please set a key");
    }
  };

  useEffect(() => {
    setValid(key.trim() !== "");
  }, [key]);

  useEffect(() => {
    coolify.getApiKey().then((key) => setKey(key ?? ""));
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.paragraph}>Enter your Coolify API key</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={setKey}
        value={key}
        placeholder="API Key"
      />
      <Button onPress={saveKey} disabled={!valid}>
        Save
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
