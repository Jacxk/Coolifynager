import { Application } from "@/api/types/application.types";
import { Link } from "expo-router";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

type ApplicationCardProps = {
  application: Application;
};

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Link
      href={{
        pathname: "/main/applications/[uuid]",
        params: { uuid: application.uuid },
      }}
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{application.name}</CardTitle>
          <CardDescription>{application.status.split(":")[1]}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
