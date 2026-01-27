import useSetup from "@/hooks/useSetup";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootIndex() {
  const { setupComplete } = useSetup();

  if (setupComplete === null) return null;

  if (setupComplete) return <Redirect href="/main" />;
  else return <Redirect href="/setup" />;
}
