import { ResourceActionResponse, ResourceBase } from "./resources.types";
import { Server } from "./server.types";

export type ApplicationBase = ResourceBase & {
  id: number;
  base_directory: string;
  build_pack: string;
  build_command: string;
  start_command: string;
  fqdn: string;
  git_repository: string;
  git_branch: string;
  git_commit_sha: string;
};

export type Application = ApplicationBase & {
  server?: Server;
};

export type SingleApplication = ApplicationBase & {
  additional_networks_count: number;
  additional_servers: Server[];
  additional_servers_count: number;
  compose_parsing_version: string;
  custom_healthcheck_found: boolean;
  custom_labels: string;
  custom_network_aliases: string | null;
  custom_nginx_configuration: string | null;
  docker_compose: string | null;
  docker_compose_custom_build_command: string | null;
  docker_compose_custom_start_command: string | null;
  docker_compose_domains: string | null;
  docker_compose_location: string;
  docker_compose_raw: string | null;
  docker_registry_image_name: string | null;
  docker_registry_image_tag: string | null;
  dockerfile: string | null;
  dockerfile_location: string;
  dockerfile_target_build: string | null;
  git_full_url: string | null;
  health_check_enabled: boolean;
  health_check_host: string;
  health_check_interval: number;
  health_check_method: string;
  health_check_path: string;
  health_check_port: number | null;
  health_check_response_text: string | null;
  health_check_retries: number;
  health_check_return_code: number;
  health_check_scheme: string;
  health_check_start_period: number;
  health_check_timeout: number;
  http_basic_auth_password: string | null;
  http_basic_auth_username: string | null;
  install_command: string;
  is_http_basic_auth_enabled: boolean;
  laravel_through_key: number;
  manual_webhook_secret_bitbucket: string | null;
  manual_webhook_secret_gitea: string | null;
  manual_webhook_secret_github: string | null;
  manual_webhook_secret_gitlab: string | null;
  ports_exposes: string;
  post_deployment_command: string | null;
  post_deployment_command_container: string | null;
  pre_deployment_command: string | null;
  pre_deployment_command_container: string | null;
  preview_url_template: string;
  private_key_id: number | null;
  publish_directory: string;
  redirect: string;
  repository_project_id: number;
  source_id: number;
  source_type: string;
  static_image: string;
  swarm_placement_constraints: string | null;
  swarm_replicas: number;
  watch_paths: string | null;
};

export type ApplicationLogs = {
  logs: string;
};

export type ApplicationEnv = {
  id: number;
  uuid: string;
  resourceable_type: string;
  resourceable_id: number;
  is_build_time: boolean;
  is_literal: boolean;
  is_multiline: boolean;
  is_preview: boolean;
  is_shared: boolean;
  is_shown_once: boolean;
  key: string;
  value: string;
  real_value: string;
  version: string;
  created_at: string;
  updated_at: string;
};

export type CreateApplicationEnvBody = {
  key: string;
  value: string;
  is_preview: boolean;
  is_build_time: boolean;
  is_literal: boolean;
  is_multiline?: boolean;
  is_shown_once?: boolean;
};

export type CreateApplicationEnvResponse = {
  uuid: string;
  message?: string;
  errors?: {
    [key: number]: string[];
    key: string[];
  };
};

export type ApplicationActionResponse = ResourceActionResponse & {
  deployment_uuid: string;
};
