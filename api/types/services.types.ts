import type { ApplicationBase } from "./application.types";
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

export type ServiceBase = {
  uuid: string;
  name: string;
  description: string | null;
  environment_id: number;
  server_id: number;
  docker_compose_raw: string;
  docker_compose: string;
  destination_type: string;
  destination_id: number;
  connect_to_docker_network: boolean;
  config_hash: string;
  service_type: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  status: string;
  server_status: boolean;
  compose_parsing_version: string;
  applications: ServiceApplication[];
  databases: Array<unknown>;
};

export type Service = ServiceBase;

export type SingleService = ServiceBase & {
  is_container_label_escape_enabled: boolean;
  is_container_label_readonly_enabled: boolean;
  laravel_through_key: number;
  server: SingleServer;
};
