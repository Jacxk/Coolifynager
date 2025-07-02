import { Service } from "@/api/types/services.types";
import { Link } from "expo-router";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export type ServiceCardProps = {
  service: Service;
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link
      href={{
        pathname: "/main/services/[uuid]",
        params: { uuid: service.uuid },
      }}
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{service.name}</CardTitle>
          <CardDescription>{service.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
