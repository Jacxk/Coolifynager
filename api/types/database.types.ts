import { ResourceBase } from "./resources.types";

export type Database = ResourceBase & {
  database_type: string;
  enable_ssl: boolean;
  external_db_url: string | null;
  image: string;
  init_scripts: string | null;
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
  ssl_mode: string;
  started_at: string;
};
