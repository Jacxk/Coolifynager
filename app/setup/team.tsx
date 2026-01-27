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
import { Href, router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";

export default function TeamStep() {
  const { redirect } = useLocalSearchParams<{ redirect: Href<any> }>();
  const { team, setTeam } = useSetup();
  const { data, isPending } = useTeams();

  if (isPending) {
    return <LoadingScreen className="bg-branding" />;
  }

  if (!data || data.length === 0) {
    return (
      <SetupScreenContainer scrollviewClassName="gap-4">
        <View>
          <H1 className="text-white text-lg">No teams found</H1>
        </View>
      </SetupScreenContainer>
    );
  }

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
      <Button
        onPress={() => {
          router.dismissTo(redirect ?? "/main");
        }}
      >
        <Text>Continue</Text>
      </Button>
    </SetupScreenContainer>
  );
}
