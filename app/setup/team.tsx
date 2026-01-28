import { useTeams } from "@/api/teams";
import LoadingScreen from "@/components/LoadingScreen";
import SetupScreenContainer from "@/components/SetupScreenContainer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { H1, P } from "@/components/ui/typography";
import useSetup from "@/hooks/useSetup";
import { cn } from "@/lib/utils";
import { router, useLocalSearchParams } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";

export default function TeamStep() {
  const { nextStep } = useLocalSearchParams<{ nextStep: string }>();
  const { serverAddress, team, setTeam } = useSetup();
  const { data, isPending } = useTeams();

  if (isPending) {
    return <LoadingScreen className="bg-branding" />;
  }

  if (!data || data.length === 0) {
    return (
      <SetupScreenContainer scrollviewClassName="gap-4">
        <View>
          <H1>No teams found</H1>
          <P>
            We couldn't find any teams on the server. Please contact your
            administrator. If you are the administrator, you can create a team
            by{" "}
            <Button
              variant="link"
              onPress={() => {
                openBrowserAsync(`${serverAddress}/team`);
              }}
            >
              clicking here.
            </Button>
          </P>
        </View>
      </SetupScreenContainer>
    );
  }

  const isTeamSelected = team && team !== "NO_TEAM_SELECTED";
  const onContinue = () => {
    if (isTeamSelected) {
      router.dismissTo(
        nextStep === "permissions" ? "/setup/permissions" : "/main",
      );
    }
  };

  return (
    <SetupScreenContainer scrollviewClassName="gap-4">
      <View>
        <H1 className="text-white text-lg">Select Team</H1>
        <P>
          Select the primary team you want to use. You can change this later in
          the settings.
        </P>
      </View>
      {data?.map((eachTeam) => (
        <GestureDetector
          key={eachTeam.id}
          gesture={Gesture.Tap().onStart(() => {
            scheduleOnRN(setTeam, eachTeam.id.toString());
          })}
        >
          <Card
            className={cn({
              "border border-dashed border-primary":
                String(eachTeam.id) === team,
            })}
          >
            <CardHeader>
              <CardTitle>{eachTeam.name}</CardTitle>
              <CardDescription>{eachTeam.description}</CardDescription>
            </CardHeader>
          </Card>
        </GestureDetector>
      ))}
      {(!team || team === "NO_TEAM_SELECTED") && (
        <Text className="text-destructive text-sm">
          Please select a team to continue.
        </Text>
      )}
      <Button disabled={!isTeamSelected} onPress={onContinue}>
        <Text>Continue</Text>
      </Button>
    </SetupScreenContainer>
  );
}
