import EnvironmentVariableList from "@/components/EnvironmentVariableList";
import { useGlobalSearchParams } from "expo-router";

export default function ApplicationEnvironmentsIndex() {
  const { uuid } = useGlobalSearchParams<{ uuid: string }>();

  return <EnvironmentVariableList uuid={uuid} />;
}
