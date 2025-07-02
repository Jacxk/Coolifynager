import { getHealth, validToken } from "@/api/status";
import { Secrets } from "@/constants/Secrets";
import SecureStore from "@/utils/SecureStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export default function useSetup() {
  const [apiTokenSaved, setApiTokenSaved] = useState(false);
  const [serverAddressSaved, setServerAddressSaved] = useState(false);

  const getApiToken = () => SecureStore.getItemAsync(Secrets.API_TOKEN);
  const setApiToken = async (key: string) => {
    const isValid = await validToken(key)
    if (!isValid) 
      throw new Error("INVALID_TOKEN");

    await SecureStore.setItemAsync(Secrets.API_TOKEN, key);
    setApiTokenSaved(true);
  };

  const getServerAddress = () =>
    SecureStore.getItemAsync(Secrets.SERVER_ADDRESS);
  const setServerAddress = async (address: string) => {
    try {
      new URL(address);
    } catch (e) {
      throw new Error("INVALID_URL");
    }

    const health = await getHealth(address);

    if (health !== "OK")
      throw new Error("INVALID_SERVER");

    await SecureStore.setItemAsync(
      Secrets.SERVER_ADDRESS,
      address.replace(/\/api$|\/$/, "")
    );
    setServerAddressSaved(true);
  };

  const resetSetup = async () => {
    await SecureStore.deleteItemAsync(Secrets.API_TOKEN);
    await SecureStore.deleteItemAsync(Secrets.SERVER_ADDRESS);

    await AsyncStorage.setItem("SetupComplete", "false");

    router.dismissTo("/setup/serverAddress");
  };

  useEffect(() => {
    getApiToken().then((api) => setApiTokenSaved(!!api));
    getServerAddress().then((server) => setServerAddressSaved(!!server));
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(
      "SetupComplete",
      String(apiTokenSaved && serverAddressSaved)
    );
  }, [apiTokenSaved, serverAddressSaved]);

  return {
    setApiToken,
    getApiToken,
    setServerAddress,
    getServerAddress,
    resetSetup,
  };
}
