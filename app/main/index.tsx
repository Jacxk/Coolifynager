import { getApplications } from "@/api/application";
import { getProjects } from "@/api/projects";
import { getServers } from "@/api/servers";
import { getServices } from "@/api/services";
import { getTeams } from "@/api/teams";
import { ApplicationCard } from "@/components/ApplicationCard";
import LoadingScreen from "@/components/LoadingScreen";
import { ProjectCard } from "@/components/ProjectCard";
import { ServerCard } from "@/components/ServerCard";
import { ServiceCard } from "@/components/ServiceCard";
import { TeamCard } from "@/components/TeamCard";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, H2 } from "@/components/ui/typography";
import useSetup from "@/hooks/useSetup";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";

export default function Index() {
  const { data: applications, isPending: isPendingApplications } =
    useQuery(getApplications);
  const { data: projects, isPending: isPendingProjects } =
    useQuery(getProjects);
  const { data: servers, isPending: isPendingServers } = useQuery(getServers);
  const { data: services, isPending: isPendingServices } =
    useQuery(getServices);
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
      <H1>App index</H1>
      <Button
        onPress={() => {
          setup.resetSetup();
        }}
      >
        <Text>Reset</Text>
      </Button>
      <H2>Applications</H2>
      {applications?.map((application) => (
        <ApplicationCard application={application} key={application.uuid} />
      ))}
      <H2>Projects</H2>
      {projects?.map((project) => (
        <ProjectCard project={project} key={project.uuid} />
      ))}
      <H2>Servers</H2>
      {servers?.map((server) => (
        <ServerCard server={server} key={server.uuid} />
      ))}
      <H2>Services</H2>
      {services?.map((service) => (
        <ServiceCard service={service} key={service.uuid} />
      ))}
      <H2>Teams</H2>
      {teams?.map((team) => (
        <TeamCard team={team} key={team.id} />
      ))}
    </View>
  );
}
