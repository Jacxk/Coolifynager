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

// Base database properties that all databases share
export type DatabaseBase = ResourceBase & {
  database_type: CoolifyDatabaseType;
  enable_ssl: boolean;
  external_db_url: string | null;
  image: string;
  init_scripts: InitScript[] | null;
  internal_db_url: string;
  is_include_timestamps: boolean;
  is_log_drain_enabled: boolean;
  is_public: boolean;
  public_port: number | null;
  ssl_mode: SSLMode;
  started_at: string;
};

// PostgreSQL specific properties
export type PostgreSQLDatabase = DatabaseBase & {
  database_type: CoolifyDatabaseType.POSTGRESQL;
  postgres_conf: string | null;
  postgres_db: string;
  postgres_host_auth_method: string | null;
  postgres_initdb_args: string | null;
  postgres_password: string;
  postgres_user: string;
};

// MySQL specific properties
export type MySQLDatabase = DatabaseBase & {
  database_type: CoolifyDatabaseType.MYSQL;
  mysql_root_password: string;
  mysql_password: string;
  mysql_user: string;
  mysql_database: string;
  mysql_conf: string;
};

// MariaDB specific properties
export type MariaDBDatabase = DatabaseBase & {
  database_type: CoolifyDatabaseType.MARIADB;
  mariadb_conf: string;
  mariadb_root_password: string;
  mariadb_user: string;
  mariadb_password: string;
  mariadb_database: string;
};

// MongoDB specific properties
export type MongoDBDatabase = DatabaseBase & {
  database_type: CoolifyDatabaseType.MONGODB;
  mongo_conf: string;
  mongo_initdb_root_username: string;
  mongo_initdb_root_password: string;
  mongo_initdb_database: string;
};

// Redis specific properties
export type RedisDatabase = DatabaseBase & {
  database_type: CoolifyDatabaseType.REDIS;
  redis_password: string;
  redis_conf: string;
};

// DragonFly specific properties
export type DragonFlyDatabase = DatabaseBase & {
  database_type: CoolifyDatabaseType.DRAGONFLY;
  dragonfly_password: string;
};

// KeyDB specific properties
export type KeyDBDatabase = DatabaseBase & {
  database_type: CoolifyDatabaseType.KEYDB;
  keydb_password: string;
  keydb_conf: string;
};

// ClickHouse specific properties
export type ClickHouseDatabase = DatabaseBase & {
  database_type: CoolifyDatabaseType.CLICKHOUSE;
  clickhouse_admin_user: string;
  clickhouse_admin_password: string;
};

// Union type for all database types
export type Database =
  | PostgreSQLDatabase
  | MySQLDatabase
  | MariaDBDatabase
  | MongoDBDatabase
  | RedisDatabase
  | DragonFlyDatabase
  | KeyDBDatabase
  | ClickHouseDatabase;

// Type guards for each database type
export const isPostgreSQLDatabase = (db: Database): db is PostgreSQLDatabase =>
  db.database_type === CoolifyDatabaseType.POSTGRESQL;

export const isMySQLDatabase = (db: Database): db is MySQLDatabase =>
  db.database_type === CoolifyDatabaseType.MYSQL;

export const isMariaDBDatabase = (db: Database): db is MariaDBDatabase =>
  db.database_type === CoolifyDatabaseType.MARIADB;

export const isMongoDBDatabase = (db: Database): db is MongoDBDatabase =>
  db.database_type === CoolifyDatabaseType.MONGODB;

export const isRedisDatabase = (db: Database): db is RedisDatabase =>
  db.database_type === CoolifyDatabaseType.REDIS;

export const isDragonFlyDatabase = (db: Database): db is DragonFlyDatabase =>
  db.database_type === CoolifyDatabaseType.DRAGONFLY;

export const isKeyDBDatabase = (db: Database): db is KeyDBDatabase =>
  db.database_type === CoolifyDatabaseType.KEYDB ||
  "keydb_password" in db ||
  "keydb_conf" in db;

export const isClickHouseDatabase = (db: Database): db is ClickHouseDatabase =>
  db.database_type === CoolifyDatabaseType.CLICKHOUSE;

// Base update properties that all databases share
export type UpdateDatabaseBaseBody = Partial<{
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
}>;

// PostgreSQL specific update properties
export type UpdatePostgreSQLDatabaseBody = UpdateDatabaseBaseBody &
  Partial<{
    postgres_user: string;
    postgres_password: string;
    postgres_db: string;
    postgres_initdb_args: string | null;
    postgres_host_auth_method: string | null;
    postgres_conf: string | null;
  }>;

// MySQL specific update properties
export type UpdateMySQLDatabaseBody = UpdateDatabaseBaseBody &
  Partial<{
    mysql_root_password: string;
    mysql_password: string;
    mysql_user: string;
    mysql_database: string;
    mysql_conf: string;
  }>;

// MariaDB specific update properties
export type UpdateMariaDBDatabaseBody = UpdateDatabaseBaseBody &
  Partial<{
    mariadb_conf: string;
    mariadb_root_password: string;
    mariadb_user: string;
    mariadb_password: string;
    mariadb_database: string;
  }>;

// MongoDB specific update properties
export type UpdateMongoDBDatabaseBody = UpdateDatabaseBaseBody &
  Partial<{
    mongo_conf: string;
    mongo_initdb_root_username: string;
    mongo_initdb_root_password: string;
    mongo_initdb_database: string;
  }>;

// Redis specific update properties
export type UpdateRedisDatabaseBody = UpdateDatabaseBaseBody &
  Partial<{
    redis_password: string;
    redis_conf: string;
  }>;

// DragonFly specific update properties
export type UpdateDragonFlyDatabaseBody = UpdateDatabaseBaseBody &
  Partial<{
    dragonfly_password: string;
  }>;

// KeyDB specific update properties
export type UpdateKeyDBDatabaseBody = UpdateDatabaseBaseBody &
  Partial<{
    keydb_password: string;
    keydb_conf: string;
  }>;

// ClickHouse specific update properties
export type UpdateClickHouseDatabaseBody = UpdateDatabaseBaseBody &
  Partial<{
    clickhouse_admin_user: string;
    clickhouse_admin_password: string;
  }>;

// Union type for all database update bodies
export type UpdateDatabaseBody =
  | UpdatePostgreSQLDatabaseBody
  | UpdateMySQLDatabaseBody
  | UpdateMariaDBDatabaseBody
  | UpdateMongoDBDatabaseBody
  | UpdateRedisDatabaseBody
  | UpdateDragonFlyDatabaseBody
  | UpdateKeyDBDatabaseBody
  | UpdateClickHouseDatabaseBody;

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

export enum CoolifyDatabaseType {
  POSTGRESQL = "standalone-postgresql",
  MYSQL = "standalone-mysql",
  MARIADB = "standalone-mariadb",
  MONGODB = "standalone-mongodb",
  REDIS = "standalone-redis",
  DRAGONFLY = "standalone-dragonfly",
  KEYDB = "standalone-keydb",
  CLICKHOUSE = "standalone-clickhouse",
}

export const CoolifyDatabaseMetadataList: CoolifyResourceMetadata[] = [
  {
    name: "PostgreSQL",
    description:
      "A powerful, open source object-relational database system with a strong reputation for reliability, feature robustness, and performance.",
    docs: "https://coolify.io/docs/databases/postgresql",
    type: CoolifyDatabases.POSTGRESQL,
  },
  {
    name: "MySQL",
    description:
      "The world's most popular open source database, known for its reliability and ease of use.",
    docs: "https://coolify.io/docs/databases/mysql",
    type: CoolifyDatabases.MYSQL,
  },
  {
    name: "MariaDB",
    description:
      "A community-developed, commercially supported fork of MySQL, intended to remain free and open source.",
    docs: "https://coolify.io/docs/databases/mariadb",
    type: CoolifyDatabases.MARIADB,
  },
  {
    name: "MongoDB",
    description:
      "A general purpose, document-based, distributed database built for modern application developers and for the cloud era.",
    docs: "https://coolify.io/docs/databases/mongodb",
    type: CoolifyDatabases.MONGODB,
  },
  {
    name: "Redis",
    description:
      "An in-memory data store used as a database, cache, vector database, document database, streaming engine, and message broker.",
    docs: "https://coolify.io/docs/databases/redis",
    type: CoolifyDatabases.REDIS,
  },
  {
    name: "DragonFly",
    description:
      "A modern, multi-threaded, drop-in Redis replacement designed for high performance and scalability.",
    docs: "https://coolify.io/docs/databases/dragonfly",
    type: CoolifyDatabases.DRAGONFLY,
  },
  {
    name: "KeyDB",
    description:
      "A high-performance fork of Redis, focusing on multithreading, memory efficiency, and high availability.",
    docs: "https://coolify.io/docs/databases/keydb",
    type: CoolifyDatabases.KEYDB,
  },
  {
    name: "Clickhouse",
    description:
      "A fast open-source column-oriented database management system for online analytical processing (OLAP).",
    docs: "https://coolify.io/docs/databases/clickhouse",
    type: CoolifyDatabases.CLICKHOUSE,
  },
];

export type CreateDatabaseBody = {
  server_uuid: string;
  project_uuid: string;
  environment_uuid: string;
  environment_name?: string;
  name?: string;
  description?: string;
  image?: string;
  is_public?: boolean;
  public_port?: number;
  instant_deploy?: boolean;
  destination_uuid?: string;
};

export type CreatePostgresqlDatabaseBody = CreateDatabaseBody & {
  postgres_user: string;
  postgres_password: string;
  postgres_db: string;
  postgres_initdb_args: string;
  postgres_host_auth_method: string;
  postgres_conf: string;
};

export type CreateMysqlDatabaseBody = CreateDatabaseBody & {
  mysql_root_password: string;
  mysql_password: string;
  mysql_user: string;
  mysql_database: string;
  mysql_conf: string;
};

export type CreateMariadbDatabaseBody = CreateDatabaseBody & {
  mariadb_conf: string;
  mariadb_root_password: string;
  mariadb_user: string;
  mariadb_password: string;
  mariadb_database: string;
};
