import {
  CoolifyResourceMetadata,
  ResourceActionResponse,
  ResourceBase,
  ResourceUpdateResponse,
} from "./resources.types";
import { Server } from "./server.types";

export type ApplicationBase = ResourceBase & {
  id: number;
  base_directory: string;
  build_pack: BuildPack;
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
  redirect: RedirectType;
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

export type CreateApplicationEnvResponse = ResourceUpdateResponse;

export type ApplicationActionResponse = ResourceActionResponse & {
  deployment_uuid: string;
};

export enum BuildPack {
  nixpacks = "nixpacks",
  static = "static",
  dockerfile = "dockerfile",
  dockercompose = "dockercompose",
}

export enum RedirectType {
  www = "www",
  nonWww = "non-www",
  both = "both",
}

export type UpdateApplicationBody = Partial<
  Omit<
    SingleApplication,
    | "id"
    | "uuid"
    | "config_hash"
    | "destination"
    | "destination_id"
    | "destination_type"
    | "environment_id"
    | "deleted_at"
    | "status"
    | "server_status"
    | "created_at"
    | "updated_at"
    | "last_online_at"
    | "fqdn"
    | "additional_networks_count"
    | "additional_servers"
    | "additional_servers_count"
    | "compose_parsing_version"
    | "custom_healthcheck_found"
    | "dockerfile_location"
    | "dockerfile_target_build"
    | "git_full_url"
    | "laravel_through_key"
    | "preview_url_template"
    | "private_key_id"
    | "repository_project_id"
    | "source_id"
    | "source_type"
    | "swarm_placement_constraints"
    | "swarm_replicas"
  > & {
    project_uuid: string;
    server_uuid: string;
    environment_name: string;
    github_app_uuid: string;
    destination_uuid: string;
    domains: string;
    is_static: boolean;
    instant_deploy: boolean;
    use_build_server: boolean;
    connect_to_docker_network: boolean;
    build_pack: BuildPack;
    redirect: RedirectType;
  }
>;

export enum CoolifyApplications {
  PUBLIC_REPOSITORY = "public-repository",
  PRIVATE_REPOSITORY_GITHUB = "private-repository-github",
  PRIVATE_REPOSITORY_DEPLOY_KEY = "private-repository-deploy-key",
  DOCKERFILE = "dockerfile",
  DOCKER_COMPOSE_EMPTY = "docker-compose-empty",
  DOCKER_IMAGE = "docker-image",
}

export const CoolifyApplicationMetadataList: CoolifyResourceMetadata[] = [
  {
    name: "Public Repository",
    description:
      "You can deploy any kind of public repositories from the supported git providers.",
    docs: "https://coolify.io/docs/applications/",
    type: CoolifyApplications.PUBLIC_REPOSITORY,
  },
  {
    name: "Private Repository (with GitHub App)",
    description:
      "You can deploy public & private repositories through your GitHub Apps.",
    docs: "https://coolify.io/docs/applications/",
    type: CoolifyApplications.PRIVATE_REPOSITORY_GITHUB,
  },
  {
    name: "Private Repository (with Deploy Key)",
    description: "You can deploy private repositories with a deploy key.",
    docs: "https://coolify.io/docs/applications/",
    type: CoolifyApplications.PRIVATE_REPOSITORY_DEPLOY_KEY,
  },
  {
    name: "Dockerfile",
    description: "You can deploy a simple Dockerfile, without Git.",
    docs: "https://coolify.io/docs/applications/#dockerfile",
    type: CoolifyApplications.DOCKERFILE,
  },
  {
    name: "Docker Compose Empty",
    description:
      "You can deploy complex application easily with Docker Compose, without Git.",
    docs: "https://coolify.io/docs/applications/#docker-compose",
    type: CoolifyApplications.DOCKER_COMPOSE_EMPTY,
  },
  {
    name: "Docker Image",
    description:
      "You can deploy an existing Docker Image from any Registry, without Git.",
    docs: "https://coolify.io/docs/applications/#docker-image",
    type: CoolifyApplications.DOCKER_IMAGE,
  },
];
