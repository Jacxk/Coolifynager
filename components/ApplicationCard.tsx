import { Application } from "@/api/types";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

type ApplicationCardProps = {
  application: Application;
};

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{application.name}</CardTitle>
        <CardDescription>{application.status.split(":")[1]}</CardDescription>
      </CardHeader>
    </Card>
  );
}
