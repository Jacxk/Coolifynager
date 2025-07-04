import { Project } from "@/api/types/project.types";
import { useFavorites } from "@/hooks/useFavorites";
import { Link } from "expo-router";
import { Star } from "../icons/Star";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites<typeof project>("uuid");
  const favorite = { ...project, type: "project" };
  return (
    <Link
      href={{
        pathname: "/main/projects/[uuid]",
        params: { uuid: project.uuid, name: project.name },
      }}
    >
      <Card className="w-full max-w-sm relative">
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4"
          onPress={() => toggleFavorite(favorite)}
        >
          <Star
            className={
              isFavorite(project) ? "text-yellow-500" : "text-foreground"
            }
          />
        </Button>
      </Card>
    </Link>
  );
}
