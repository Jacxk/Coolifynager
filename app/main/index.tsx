import { getApplications } from "@/api/application";
import { getProjects } from "@/api/projects";
import { getServers } from "@/api/servers";
import { getServices } from "@/api/services";
import { getTeams } from "@/api/teams";
import { ApplicationCard } from "@/components/ApplicationCard";
import { ProjectCard } from "@/components/ProjectCard";
import { ServerCard } from "@/components/ServerCard";
import { ServiceCard } from "@/components/ServiceCard";
import { TeamCard } from "@/components/TeamCard";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import useSetup from "@/hooks/useSetup";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";

import LoadingScreen from "@/components/LoadingScreen";

export default function Index() {
  const {
    data: applications,
    isPending: isPendingApplications,
  } = useQuery(getApplications);
  const { data: projects, isPending: isPendingProjects } = useQuery(getProjects);
  const { data: servers, isPending: isPendingServers } = useQuery(getServers);
  const { data: services, isPending: isPendingServices } = useQuery(getServices);
  const { data: teams, isPending: isPendingTeams } = useQuery(getTeams);

  const setup = useSetup();

  const isPending =
    isPendingApplications ||
    isPendingProjects ||
    isPendingServers ||
    isPendingServices ||
    isPendingTeams;

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <View className="p-8">
      <Text>App index</Text>
      <Button
        onPress={() => {
          setup.resetSetup();
        }}
      >
        <Text>Reset</Text>
      </Button>
      <Text>Applications</Text>
      {applications?.map((application) => (
        <ApplicationCard application={application} key={application.uuid} />
      ))}
      <Text>Projects</Text>
      {projects?.map((project) => (
        <ProjectCard project={project} key={project.uuid} />
      ))}
      <Text>Servers</Text>
      {servers?.map((server) => (
        <ServerCard server={server} key={server.uuid} />
      ))}
      <Text>Services</Text>
      {services?.map((service) => (
        <ServiceCard service={service} key={service.uuid} />
      ))}
      <Text>Teams</Text>
      {teams?.map((team) => (
        <TeamCard team={team} key={team.id} />
      ))}
    </View>
  );
}
