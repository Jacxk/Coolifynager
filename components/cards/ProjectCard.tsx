import { getProject } from "@/api/projects";
import { Project } from "@/api/types/project.types";
import { FavoriteResource, useFavorites } from "@/hooks/useFavorites";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { Star } from "../icons/Star";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const isFocused = useIsFocused();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favoriteData: FavoriteResource = {
    uuid: project.uuid,
    type: "project",
  };

  const { data } = useQuery(
    getProject(project.uuid, {
      enabled: (!project.name || !project.description) && isFocused,
    })
  );

  if (!data) return null;

  return (
    <Link
      href={{
        pathname: "/main/projects/[uuid]",
        params: { uuid: data.uuid, name: data.name },
      }}
    >
      <Card className="w-full max-w-sm relative">
        <CardHeader>
          <CardTitle>{project.name ?? data.name}</CardTitle>
          <CardDescription>
            {project.description ?? data.description}
          </CardDescription>
        </CardHeader>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4"
          onPress={() => toggleFavorite(favoriteData)}
        >
          <Star
            className={
              isFavorite(favoriteData) ? "text-yellow-500" : "text-foreground"
            }
          />
        </Button>
      </Card>
    </Link>
  );
}
