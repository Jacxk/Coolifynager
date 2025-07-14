import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLayoutEffect, useState } from "react";

type UseStorageProps = Partial<{
  defaultServer: {
    name: string;
    uuid: string;
  };
}>;

export default function useStorage({ defaultServer }: UseStorageProps) {
  const [server, changeServer] =
    useState<UseStorageProps["defaultServer"]>(defaultServer);

  useLayoutEffect(() => {
    const loadStorage = async () => {
      const server = await AsyncStorage.getItem("selectedServer");
      const environment = await AsyncStorage.getItem("selectedEnvironment");

      changeServer(server ? JSON.parse(server) : defaultServer);
    };

    loadStorage();
  }, []);

  const setServer = (server: UseStorageProps["defaultServer"]) => {
    changeServer(server);
    AsyncStorage.setItem("selectedServer", JSON.stringify(server));
  };

  return {
    server,
    setServer,
  };
}
