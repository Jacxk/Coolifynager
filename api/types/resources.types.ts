import { CoolifyApplications } from "./application.types";
import { CoolifyDatabases } from "./database.types";
import { SingleServer } from "./server.types";
import { CoolifyServices } from "./services.types";

export type ResourceDestination = {
  id: number;
  uuid: string;
  name: string;
  network: string;
  server_id: number;
  created_at: string;
  updated_at: string;
  server: SingleServer;
};

export type ResourceBase = {
  uuid: string;
  name: string;
  description: string | null;
  config_hash: string;
  destination: ResourceDestination;
  destination_id: number;
  destination_type: string;
  environment_id: number;
  deleted_at: string | null;
  status: string;
  server_status: boolean;
  created_at: string;
  updated_at: string;
  custom_docker_run_options: string | null;
  limits_cpu_shares: number;
  limits_cpus: string;
  limits_cpuset: string | null;
  limits_memory: string;
  limits_memory_reservation: string;
  limits_memory_swap: string;
  limits_memory_swappiness: number;
  ports_mappings: string | null;
  last_online_at: string | null;
};

export type ResourceFromListType =
  | "application"
  | "standalone-postgresql"
  | "service";

export type Resource = ResourceBase & {
  type: ResourceFromListType;
  id: number;
  repository_project_id: number;
  fqdn: string;
  git_repository: string;
  git_branch: string;
  git_commit_sha: string;
  git_full_url: string | null;
  docker_registry_image_name: string | null;
  docker_registry_image_tag: string | null;
  build_pack: string;
  static_image: string;
  install_command: string;
  build_command: string;
  start_command: string;
  ports_exposes: string;
  base_directory: string;
  publish_directory: string;
  health_check_path: string;
  health_check_port: number | null;
  health_check_host: string;
  health_check_method: string;
  health_check_return_code: number;
  health_check_scheme: string;
  health_check_response_text: string | null;
  health_check_interval: number;
  health_check_timeout: number;
  health_check_retries: number;
  health_check_start_period: number;
  preview_url_template: string;
  source_id: number;
  source_type: string;
  private_key_id: number | null;
  dockerfile: string | null;
  health_check_enabled: boolean;
  dockerfile_location: string;
  custom_labels: string;
  dockerfile_target_build: string | null;
  manual_webhook_secret_github: string | null;
  manual_webhook_secret_gitlab: string | null;
  docker_compose_location: string;
  docker_compose: string | null;
  docker_compose_raw: string | null;
  docker_compose_domains: string | null;
  docker_compose_custom_start_command: string | null;
  docker_compose_custom_build_command: string | null;
  swarm_replicas: number;
  swarm_placement_constraints: string | null;
  manual_webhook_secret_bitbucket: string | null;
  post_deployment_command: string | null;
  post_deployment_command_container: string | null;
  pre_deployment_command: string | null;
  pre_deployment_command_container: string | null;
  watch_paths: string | null;
  custom_healthcheck_found: boolean;
  manual_webhook_secret_gitea: string | null;
  redirect: string;
  compose_parsing_version: string;
  custom_nginx_configuration: string;
  custom_network_aliases: string | null;
  is_http_basic_auth_enabled: boolean;
  http_basic_auth_username: string | null;
  http_basic_auth_password: string | null;
  additional_servers_count: number;
  additional_networks_count: number;
  laravel_through_key: number;
  additional_servers: any[];
};

export type ResourceActionResponse = {
  message: string;
};

export type ResourceCreateResponse = {
  uuid: string;
  domains: string[];
};

export type ResourceHttpError = {
  message: string;
  errors?: {
    [key: string]: string[];
  };
};

export type ResourceUpdateResponse =
  | ResourceHttpError
  | {
      uuid: string;
    };

export type CoolifyResourceMetadata = {
  name: string;
  description: string;
  docs: string;
  type: CoolifyApplications | CoolifyDatabases | CoolifyServices;
};

export type ResourceType =
  | "application"
  | "database"
  | "service"
  | "project"
  | "server"
  | "team";

export type DeleteResourceParams = {
  delete_configurations: boolean;
  delete_volumes: boolean;
  docker_cleanup: boolean;
  delete_connected_networks: boolean;
};
