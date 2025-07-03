import EnvironmentVariableList from "@/components/EnvironmentVariableList";
import { H1 } from "@/components/ui/typography";
import { ScrollView } from "react-native";

export default function ApplicationEnvironments() {
  return (
    <ScrollView className="p-4">
      <H1 className="font-bold mb-4 text-center">Environment Variables</H1>
      <EnvironmentVariableList />
    </ScrollView>
  );
}
