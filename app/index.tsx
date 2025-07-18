import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootIndex() {
  const [setupComplete, setSetupComplete] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("SetupComplete").then((value) => {
      setSetupComplete(value === "true");
    });
  }, []);

  if (setupComplete === null) return null;

  if (setupComplete) return <Redirect href="/main" />;
  else return <Redirect href="/setup/serverAddress" />;
}
