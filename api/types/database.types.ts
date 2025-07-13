import { ResourceBase } from "./resources.types";

export enum SSLMode {
  DISABLED = "disabled",
  ALLOW = "allow",
  REQUIRE = "require",
  VERIFY_CA = "verify-ca",
  VERIFY_FULL = "verify-full",
}

export type InitScript = {
  index: number;
  filename: string;
  content: string;
};

export type Database = ResourceBase & {
  database_type: string;
  enable_ssl: boolean;
  external_db_url: string | null;
  image: string;
  init_scripts: InitScript[] | null;
  internal_db_url: string;
  is_include_timestamps: boolean;
  is_log_drain_enabled: boolean;
  is_public: boolean;
  postgres_conf: string | null;
  postgres_db: string;
  postgres_host_auth_method: string | null;
  postgres_initdb_args: string | null;
  postgres_password: string;
  postgres_user: string;
  public_port: number | null;
  ssl_mode: SSLMode;
  started_at: string;
};

export type UpdateDatabaseBody = Partial<{
  name: string;
  description: string | null;
  image: string;
  is_public: boolean;
  public_port: number | null;
  ports_mappings: string | null;
  limits_memory: string;
  limits_memory_swap: string;
  limits_memory_swappiness: number;
  limits_memory_reservation: string;
  limits_cpus: string;
  limits_cpuset: string | null;
  limits_cpu_shares: number;
  postgres_user: string;
  postgres_password: string;
  postgres_db: string;
  postgres_initdb_args: string | null;
  postgres_host_auth_method: string | null;
  postgres_conf: string | null;
  clickhouse_admin_user: string;
  clickhouse_admin_password: string;
  dragonfly_password: string;
  redis_password: string;
  redis_conf: string;
  keydb_password: string;
  keydb_conf: string;
  mariadb_conf: string;
  mariadb_root_password: string;
  mariadb_user: string;
  mariadb_password: string;
  mariadb_database: string;
  mongo_conf: string;
  mongo_initdb_root_username: string;
  mongo_initdb_root_password: string;
  mongo_initdb_database: string;
  mysql_root_password: string;
  mysql_password: string;
  mysql_user: string;
  mysql_database: string;
  mysql_conf: string;
}>;
