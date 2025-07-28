import type { Deployment } from "@/api/types/deployments.types";
import { cn } from "@/lib/utils";
import { StatusText } from "@/utils/status";
import { Link } from "expo-router";
import { differenceInSeconds, formatDistanceToNow, parseISO } from "date-fns";
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
  const start = parseISO(deployment.created_at);
  const end = deployment.finished_at ? parseISO(deployment.finished_at) : new Date();

  const durationSeconds = differenceInSeconds(end, start);
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;

  const runningForSeconds = differenceInSeconds(new Date(), start);
  const runningForMinutes = Math.floor(runningForSeconds / 60);
  const runningForSecondsRemaining = runningForSeconds % 60;

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
            {!isNaN(minutes) && (
              <View className="flex flex-row">
                <Text className="font-semibold">Duration: </Text>
                <Text>
                  {String(minutes).padStart(2, "0")}m {String(seconds).padStart(2, "0")}s
                </Text>
              </View>
            )}

            {deployment.finished_at && (
              <Text>
                {formatDistanceToNow(parseISO(deployment.finished_at), { addSuffix: true })}
              </Text>
            )}

            {deployment.status === "in_progress" && (
              <View className="flex flex-row">
                <Text className="font-semibold">Running for: </Text>
                <Text>
                  {String(runningForMinutes).padStart(2, "0")}m {String(runningForSecondsRemaining).padStart(2, "0")}s
                </Text>
              </View>
            )}
          </View>
        </CardContent>
      </Card>
    </Link>
  );
}
