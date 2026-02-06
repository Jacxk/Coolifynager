export type ServerProxy = {
  redirect_enabled: boolean;
};

export type SingleServerProxy = {
  redirect_enabled: boolean;
  force_stop: boolean;
  last_applied_settings: string;
  last_saved_settings: string;
  redirect_url: string | null;
  status: string;
  type: string;
};

export type ServerSettings = {
  id: number;
  server_id: number;
  concurrent_builds: number;
  dynamic_timeout: number;
  force_disabled: boolean;
  force_docker_cleanup: boolean;
  generate_exact_labels: boolean;
  is_build_server: boolean;
  is_cloudflare_tunnel: boolean;
  is_jump_server: boolean;
  is_logdrain_axiom_enabled: boolean;
  is_logdrain_custom_enabled: boolean;
  is_logdrain_highlight_enabled: boolean;
  is_logdrain_newrelic_enabled: boolean;
  is_metrics_enabled: boolean;
  is_reachable: boolean;
  is_sentinel_debug_enabled: boolean;
  is_sentinel_enabled: boolean;
  is_swarm_manager: boolean;
  is_swarm_worker: boolean;
  is_terminal_enabled: boolean;
  is_usable: boolean;
  logdrain_axiom_api_key: string | null;
  logdrain_axiom_dataset_name: string | null;
  logdrain_custom_config: string | null;
  logdrain_custom_config_parser: string | null;
  logdrain_highlight_project_id: string | null;
  logdrain_newrelic_base_uri: string | null;
  logdrain_newrelic_license_key: string | null;
  sentinel_custom_url: string;
  sentinel_metrics_history_days: number;
  sentinel_metrics_refresh_rate_seconds: number;
  sentinel_push_interval_seconds: number;
  sentinel_token: string;
  server_disk_usage_check_frequency: string;
  server_disk_usage_notification_threshold: number;
  server_timezone: string;
  docker_cleanup_frequency: string;
  docker_cleanup_threshold: number;
  delete_unused_volumes: boolean;
  delete_unused_networks: boolean;
  wildcard_domain: string;
  created_at: string;
  updated_at: string;
};

export type ServerBase = {
  uuid: string;
  name: string;
  description: string;
  ip: string;
  port: number;
  user: string;
  is_coolify_host: boolean;
  is_reachable: boolean;
  is_usable: boolean;
  settings: ServerSettings;
};

export type Server = ServerBase & {
  proxy: ServerProxy;
  team_id?: number;
};

export type SingleServer = ServerBase & {
  proxy: SingleServerProxy;
  ip_previous: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  high_disk_usage_notification_sent: boolean;
  log_drain_notification_sent: boolean;
  private_key_id: number;
  sentinel_updated_at: string;
  swarm_cluster: string | null;
  team_id: number;
  unreachable_count: number;
  unreachable_notification_sent: boolean;
  validation_logs: string | null;
};
