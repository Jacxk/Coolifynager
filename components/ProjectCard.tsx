import { Project } from "@/api/types/project.types";
import { Link } from "expo-router";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={{
        pathname: "/main/projects/[uuid]",
        params: { uuid: project.uuid, name: project.name },
      }}
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
