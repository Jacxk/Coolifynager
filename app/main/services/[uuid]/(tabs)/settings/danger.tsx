import DangerScreen from "@/components/DangerScreen";
import { useLocalSearchParams } from "expo-router";

export default function ServiceDangerZone() {
  const { uuid } = useLocalSearchParams();

  return <DangerScreen type="service" uuid={uuid as string} />;
}
