import type { Deployment } from "@/api/types/deployments.types";
import { cn } from "@/lib/utils";
import { StatusText } from "@/utils/status";
import { Link } from "expo-router";
import moment from "moment";
import { View } from "react-native";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Text } from "../ui/text";

interface DeploymentCardProps {
  uuid?: string;
  deployment: Deployment;
}

export function DeploymentCard({
  uuid = "never",
  deployment,
}: DeploymentCardProps) {
  const start = moment(deployment.created_at);
  const end = moment(deployment.finished_at);

  const duration = moment.duration(end.diff(start));
  const minutes = String(duration.minutes()).padStart(2, "0");
  const seconds = String(duration.seconds()).padStart(2, "0");

  const runningFor = moment.duration(moment().diff(start));
  const runningForMinutes = String(runningFor.minutes()).padStart(2, "0");
  const runningForSeconds = String(runningFor.seconds()).padStart(2, "0");

  return (
    <Link
      className="mb-2"
      href={{
        pathname: "/main/applications/[uuid]/(tabs)/deployments/logs",
        params: { uuid, deployment_uuid: deployment.deployment_uuid },
      }}
    >
      <Card className="w-full">
        <CardHeader className="flex flex-row justify-between">
          <CardTitle className="w-3/4">
            {deployment.commit_message ?? "Manual Deployment"}
          </CardTitle>
          <CardDescription>
            <Badge
              className={cn({
                "bg-green-500": deployment.status === "finished",
                "bg-red-500": deployment.status === "failed",
                "bg-yellow-500": deployment.status === "in_progress",
                "bg-blue-500": deployment.status === "queued",
                "bg-gray-500": deployment.status === "cancelled-by-user",
              })}
            >
              <Text className="text-white">
                {StatusText.deployment(deployment.status)}
              </Text>
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <View className="flex flex-row">
            <Text className="font-semibold">Commit: </Text>
            <Text>{deployment.commit.substring(0, 7)}</Text>
          </View>
          <View className="flex flex-row justify-between items-center">
            {!isNaN(Number(minutes)) && (
              <View className="flex flex-row">
                <Text className="font-semibold">Duration: </Text>
                <Text>
                  {minutes}m {seconds}s
                </Text>
              </View>
            )}

            {deployment.finished_at && (
              <Text>
                {moment.utc(deployment.finished_at).local().fromNow()}
              </Text>
            )}

            {deployment.status === "in_progress" && (
              <View className="flex flex-row">
                <Text className="font-semibold">Running for: </Text>
                <Text>
                  {runningForMinutes}m {runningForSeconds}s
                </Text>
              </View>
            )}
          </View>
        </CardContent>
      </Card>
    </Link>
  );
}
