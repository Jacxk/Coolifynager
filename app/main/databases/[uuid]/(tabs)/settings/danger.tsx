import DangerScreen from "@/components/DangerScreen";
import { useLocalSearchParams } from "expo-router";

export default function DatabaseDangerZone() {
  const { uuid } = useLocalSearchParams();

  return <DangerScreen type="database" uuid={uuid as string} />;
}
