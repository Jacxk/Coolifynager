import { Server } from "@/api/types/server.types";
import { Link } from "expo-router";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

type ServerCardProps = {
  server: Server;
};

export function ServerCard({ server }: ServerCardProps) {
  return (
    <Link
      href={{
        pathname: "/main/servers/[uuid]",
        params: { uuid: server.uuid },
      }}
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{server.name}</CardTitle>
          <CardDescription>{server.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
