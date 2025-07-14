import { ApplicationBase } from "./application.types";
import { ResourceBase } from "./resources.types";
import type { SingleServer } from "./server.types";

export type ServiceApplication = ApplicationBase & {
  service_id: number;
  exclude_from_status: boolean;
  exposes: string | null;
  human_name: string | null;
  image: string;
  is_gzip_enabled: boolean;
  is_include_timestamps: boolean;
  is_log_drain_enabled: boolean;
  is_migrated: boolean;
  is_stripprefix_enabled: boolean;
  required_fqdn: boolean;
};

export type ServiceBase = ResourceBase & {
  docker_compose_raw: string;
  docker_compose: string;
  connect_to_docker_network: boolean;
  service_type: string;
  compose_parsing_version: string;
  applications: ServiceApplication[];
  databases: Array<unknown>;
  server_id: number;
};

export type Service = ServiceBase;

export type SingleService = ServiceBase & {
  is_container_label_escape_enabled: boolean;
  is_container_label_readonly_enabled: boolean;
  laravel_through_key: number;
  server: SingleServer;
};

export type UpdateServiceBody = Partial<{
  name: string;
  description: string | null;
  project_uuid: string;
  environment_name: string;
  environment_uuid: string;
  server_uuid: string;
  destination_uuid: string;
  instant_deploy: boolean;
  connect_to_docker_network: boolean;
  docker_compose_raw: string;
  docker_compose: string;
}>;
