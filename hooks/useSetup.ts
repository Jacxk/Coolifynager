import { Secrets } from "@/constants/Secrets";
import SecureStore from "@/utils/SecureStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export default function useSetup() {
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [serverAddressSaved, setServerAddressSaved] = useState(false);

  const getApiKey = () => SecureStore.getItemAsync(Secrets.API_KEY);
  const setApiKey = async (key: string) => {
    await SecureStore.setItemAsync(Secrets.API_KEY, key);
    setApiKeySaved(true);
  };

  const getServerAddress = () =>
    SecureStore.getItemAsync(Secrets.SERVER_ADDRESS);
  const setServerAddress = async (address: string) => {
    try {
      new URL(address);
      await SecureStore.setItemAsync(Secrets.SERVER_ADDRESS, address);
      setServerAddressSaved(true);
    } catch (e) {
      throw new Error("Invalid server address. Please provide a valid URL.");
    }
  };

  const resetSetup = async () => {
    await SecureStore.deleteItemAsync(Secrets.API_KEY);
    await SecureStore.deleteItemAsync(Secrets.SERVER_ADDRESS);

    await AsyncStorage.setItem('SetupComplete', "false");

    router.navigate("/setup/serverAddress")
  };

  useEffect(() => {
    getApiKey().then((api) => setApiKeySaved(!!api));
    getServerAddress().then((server) => setServerAddressSaved(!!server));
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('SetupComplete', String(apiKeySaved && serverAddressSaved));
  }, [apiKeySaved, serverAddressSaved]);

  return {
    setApiKey,
    getApiKey,
    setServerAddress,
    getServerAddress,
    resetSetup,
  };
}
