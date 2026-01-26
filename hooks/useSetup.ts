import { getHealth, validateToken } from "@/api/status";
import { Secrets } from "@/constants/Secrets";
import {
  PERMISSIONS_SAVED_STORAGE_KEY,
  SETUP_COMPLETE_STORAGE_KEY,
} from "@/constants/StorageKeys";
import { isValidUrl } from "@/lib/utils";
import SecureStore from "@/utils/SecureStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export default function useSetup() {
  const [apiTokenSaved, setApiTokenSaved] = useState(false);
  const [serverAddressSaved, setServerAddressSaved] = useState(false);
  const [permissionsSaved, setIsPermissionsSaved] = useState(false);

  const getApiToken = () => SecureStore.getItemAsync(Secrets.API_TOKEN);
  const setApiToken = async (key: string) => {
    const { success, message } = await validateToken(key);

    if (message === "Unauthenticated." || message === "Invalid token.")
      throw new Error("INVALID_TOKEN");
    else if (message === "API is disabled.") throw new Error("API_DISABLED");
    else if (success === false) throw new Error(message);

    await SecureStore.setItemAsync(Secrets.API_TOKEN, key);
    setApiTokenSaved(true);
  };

  const getServerAddress = () =>
    SecureStore.getItemAsync(Secrets.SERVER_ADDRESS);
  const setServerAddress = async (address: string) => {
    if (!isValidUrl(address)) {
      throw new Error("INVALID_URL");
    }

    const health = await getHealth(address);

    if (health !== "OK") throw new Error("INVALID_SERVER");

    await SecureStore.setItemAsync(
      Secrets.SERVER_ADDRESS,
      address.replace(/\/api$|\/$/, ""),
    );
    setServerAddressSaved(true);
  };

  const getPermissionsSaved = () =>
    AsyncStorage.getItem(PERMISSIONS_SAVED_STORAGE_KEY);

  const setPermissionsSaved = async (saved: boolean) => {
    await AsyncStorage.setItem(PERMISSIONS_SAVED_STORAGE_KEY, String(saved));
    setIsPermissionsSaved(saved);
  };

  const resetSetup = async () => {
    await SecureStore.deleteItemAsync(Secrets.API_TOKEN);
    await SecureStore.deleteItemAsync(Secrets.SERVER_ADDRESS);

    await AsyncStorage.setItem(SETUP_COMPLETE_STORAGE_KEY, "false");

    router.dismissTo("/setup/serverAddress");
  };

  useEffect(() => {
    getApiToken().then((api) => setApiTokenSaved(!!api));
    getServerAddress().then((server) => setServerAddressSaved(!!server));
    getPermissionsSaved().then((permissions) =>
      setIsPermissionsSaved(!!permissions),
    );
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(
      SETUP_COMPLETE_STORAGE_KEY,
      String(apiTokenSaved && serverAddressSaved && permissionsSaved),
    );
  }, [apiTokenSaved, serverAddressSaved, permissionsSaved]);

  const isSetupComplete = () =>
    AsyncStorage.getItem(SETUP_COMPLETE_STORAGE_KEY).then(
      (value) => value === "true",
    );

  return {
    setApiToken,
    getApiToken,
    setServerAddress,
    getServerAddress,
    resetSetup,
    isSetupComplete,
    getPermissionsSaved,
    setPermissionsSaved,
  };
}
