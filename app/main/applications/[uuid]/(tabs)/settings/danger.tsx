import DangerScreen from "@/components/DangerScreen";
import { useLocalSearchParams } from "expo-router";

export default function ApplicationDangerZone() {
  const { uuid } = useLocalSearchParams();

  return <DangerScreen type="application" uuid={uuid as string} />;
}
