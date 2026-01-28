import useSetup from "@/hooks/useSetup";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootIndex() {
  const { setupComplete, team } = useSetup();

  if (setupComplete === null || team === null) return null;

  if (team === "NO_TEAM_SELECTED") return <Redirect href="/setup/team" />;
  if (setupComplete) return <Redirect href="/main" />;
  return <Redirect href="/setup" />;
}
