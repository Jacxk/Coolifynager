import { getHealth, validateToken } from "@/api/status";
import { Secrets } from "@/constants/Secrets";
import {
  PERMISSIONS_SAVED_STORAGE_KEY,
  SETUP_COMPLETE_STORAGE_KEY,
} from "@/constants/StorageKeys";
import { isValidUrl } from "@/lib/utils";
import SecureStore from "@/utils/SecureStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export default function useSetup() {
  const queryClient = useQueryClient();
  const [setupComplete, setSetupCompleteState] = useState<boolean | null>(null);
  const [serverAddress, setServerAddressState] = useState<string | null>(null);
  const [permissions, setPermissionsState] = useState<boolean | null>(null);

  const setApiToken = async (key: string) => {
    const { success, message } = await validateToken(key);

    if (message === "Unauthenticated." || message === "Invalid token.")
      throw new Error("INVALID_TOKEN");
    else if (message === "API is disabled.") throw new Error("API_DISABLED");
    else if (success === false) throw new Error(message);

    await SecureStore.setItemAsync(Secrets.API_TOKEN, key);
  };

  const setServerAddress = async (address: string) => {
    if (!isValidUrl(address)) {
      throw new Error("INVALID_URL");
    }

    const health = await getHealth(address);

    if (health !== "OK") throw new Error("INVALID_SERVER");
    queryClient.setQueryData(["server-status", address], health);

    address = address.replace(/\/api$|\/$/, "");

    if (address !== serverAddress) {
      queryClient.invalidateQueries();
      queryClient.clear();
    }

    await SecureStore.setItemAsync(Secrets.SERVER_ADDRESS, address);
    setServerAddressState(address);
  };

  const setPermissions = async (saved: boolean) => {
    await AsyncStorage.setItem(PERMISSIONS_SAVED_STORAGE_KEY, String(saved));
    setPermissionsState(saved);
  };

  const resetSetup = async () => {
    await SecureStore.deleteItemAsync(Secrets.API_TOKEN);
    await SecureStore.deleteItemAsync(Secrets.SERVER_ADDRESS);

    await AsyncStorage.setItem(SETUP_COMPLETE_STORAGE_KEY, "false");

    setSetupCompleteState(false);
    setServerAddressState(null);
    setPermissionsState(null);

    router.dismissTo("/setup/serverAddress");
  };

  const setSetupComplete = async (complete: boolean) => {
    await AsyncStorage.setItem(SETUP_COMPLETE_STORAGE_KEY, String(complete));
    setSetupCompleteState(complete);
  };

  useEffect(() => {
    AsyncStorage.getItem(SETUP_COMPLETE_STORAGE_KEY).then((value) => {
      setSetupCompleteState(value === "true");
    });
    SecureStore.getItemAsync(Secrets.SERVER_ADDRESS).then((value) => {
      setServerAddressState(value);
    });
    AsyncStorage.getItem(PERMISSIONS_SAVED_STORAGE_KEY).then((value) => {
      setPermissionsState(value === "true");
    });
  }, []);

  return {
    setupComplete,
    serverAddress,
    permissions,
    setApiToken,
    setServerAddress,
    setSetupComplete,
    setPermissions,
    resetSetup,
  };
}
