import { CoolifyResourceMetadata, ResourceBase } from "./resources.types";

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

export enum CoolifyDatabases {
  POSTGRESQL = "postgresql",
  MYSQL = "mysql",
  MARIADB = "mariadb",
  MONGODB = "mongodb",
  REDIS = "redis",
  DRAGONFLY = "dragonfly",
  KEYDB = "keydb",
  CLICKHOUSE = "clickhouse",
}

export const CoolifyDatabaseMetadataMap: Record<
  CoolifyDatabases,
  CoolifyResourceMetadata
> = {
  [CoolifyDatabases.POSTGRESQL]: {
    name: "PostgreSQL",
    description:
      "A powerful, open source object-relational database system with a strong reputation for reliability, feature robustness, and performance.",
    docs: "https://coolify.io/docs/databases/postgresql",
  },
  [CoolifyDatabases.MYSQL]: {
    name: "MySQL",
    description:
      "The world's most popular open source database, known for its reliability and ease of use.",
    docs: "https://coolify.io/docs/databases/mysql",
  },
  [CoolifyDatabases.MARIADB]: {
    name: "MariaDB",
    description:
      "A community-developed, commercially supported fork of MySQL, intended to remain free and open source.",
    docs: "https://coolify.io/docs/databases/mariadb",
  },
  [CoolifyDatabases.MONGODB]: {
    name: "MongoDB",
    description:
      "A general purpose, document-based, distributed database built for modern application developers and for the cloud era.",
    docs: "https://coolify.io/docs/databases/mongodb",
  },
  [CoolifyDatabases.REDIS]: {
    name: "Redis",
    description:
      "An in-memory data store used as a database, cache, vector database, document database, streaming engine, and message broker.",
    docs: "https://coolify.io/docs/databases/redis",
  },
  [CoolifyDatabases.DRAGONFLY]: {
    name: "DragonFly",
    description:
      "A modern, multi-threaded, drop-in Redis replacement designed for high performance and scalability.",
    docs: "https://coolify.io/docs/databases/dragonfly",
  },
  [CoolifyDatabases.KEYDB]: {
    name: "KeyDB",
    description:
      "A high-performance fork of Redis, focusing on multithreading, memory efficiency, and high availability.",
    docs: "https://coolify.io/docs/databases/keydb",
  },
  [CoolifyDatabases.CLICKHOUSE]: {
    name: "Clickhouse",
    description:
      "A fast open-source column-oriented database management system for online analytical processing (OLAP).",
    docs: "https://coolify.io/docs/databases/clickhouse",
  },
};
