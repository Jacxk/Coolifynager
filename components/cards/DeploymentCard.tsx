import { Link } from "expo-router";
import moment from "moment";
import type { Deployment } from "../../api/types/deployments.types";
import { StatusText } from "../../utils/status";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Text } from "../ui/text";

interface DeploymentCardProps {
  deployment: Deployment;
}

export function DeploymentCard({ deployment }: DeploymentCardProps) {
  const start = moment(deployment.created_at);
  const end = moment(deployment.finished_at);

  const duration = moment.duration(end.diff(start));

  const minutes = String(duration.minutes()).padStart(2, "0");
  const seconds = String(duration.seconds()).padStart(2, "0");

  return (
    <Link
      className="mb-2"
      href={{
        pathname: "./deployments/logs",
        params: { deployment_uuid: deployment.deployment_uuid },
      }}
    >
      <Card
        className="w-full"
        variant={
          deployment.status === "finished"
            ? "success"
            : deployment.status === "failed"
            ? "destructive"
            : deployment.status === "in_progress"
            ? "info"
            : deployment.status === "cancelled-by-user"
            ? "ghost"
            : "default"
        }
      >
        <CardHeader>
          <CardTitle>
            {deployment.commit_message ?? "Manual Deployment"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Text>Status: {StatusText.deployment(deployment.status)}</Text>
          <Text>Commit: {deployment.commit.substring(0, 7)}</Text>
          {deployment.status === "finished" && (
            <Text>
              Duration: {minutes}m {seconds}s
            </Text>
          )}
          {deployment.finished_at && (
            <Text>
              Finished: {moment(new Date(deployment.finished_at)).fromNow()}
            </Text>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
