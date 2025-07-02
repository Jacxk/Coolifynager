import { getApplications } from "@/api/application";
import { getProjects } from "@/api/projects";
import { getServers } from "@/api/servers";
import { getServices } from "@/api/services";
import { ApplicationCard } from "@/components/ApplicationCard";
import { ProjectCard } from "@/components/ProjectCard";
import { ServerCard } from "@/components/ServerCard";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import useSetup from "@/hooks/useSetup";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";

export default function Index() {
  const { data: applications } = useQuery(getApplications);
  const { data: projects } = useQuery(getProjects);
  const { data: servers } = useQuery(getServers);
  const { data: services } = useQuery(getServices);

  const setup = useSetup();

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
    </View>
  );
}
