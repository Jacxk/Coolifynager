import { ApplicationBase } from "./application.types";
import { CoolifyResourceMetadata, ResourceBase } from "./resources.types";
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

export type CreateServiceBody = {
  type: CoolifyServices;
  environment_uuid: string;
  server_uuid: string;
  project_uuid: string;
};

export enum CoolifyServices {
  ACTIVEPIECES = "activepieces",
  APPSMITH = "appsmith",
  APPWRITE = "appwrite",
  AUTHENTIK = "authentik",
  BABYBUDDY = "babybuddy",
  BUDGE = "budge",
  CHANGEDETECTION = "changedetection",
  CHATWOOT = "chatwoot",
  CLASSICPRESS_WITH_MARIADB = "classicpress-with-mariadb",
  CLASSICPRESS_WITH_MYSQL = "classicpress-with-mysql",
  CLASSICPRESS_WITHOUT_DATABASE = "classicpress-without-database",
  CLOUDFLARED = "cloudflared",
  CODE_SERVER = "code-server",
  DASHBOARD = "dashboard",
  DIRECTUS = "directus",
  DIRECTUS_WITH_POSTGRESQL = "directus-with-postgresql",
  DOCKER_REGISTRY = "docker-registry",
  DOCUSEAL = "docuseal",
  DOCUSEAL_WITH_POSTGRES = "docuseal-with-postgres",
  DOKUWIKI = "dokuwiki",
  DUPLICATI = "duplicati",
  EMBY = "emby",
  EMBYSTAT = "embystat",
  FIDER = "fider",
  FILEBROWSER = "filebrowser",
  FIREFLY = "firefly",
  FORMBRICKS = "formbricks",
  GHOST = "ghost",
  GITEA = "gitea",
  GITEA_WITH_MARIADB = "gitea-with-mariadb",
  GITEA_WITH_MYSQL = "gitea-with-mysql",
  GITEA_WITH_POSTGRESQL = "gitea-with-postgresql",
  GLANCE = "glance",
  GLANCES = "glances",
  GLITCHTIP = "glitchtip",
  GRAFANA = "grafana",
  GRAFANA_WITH_POSTGRESQL = "grafana-with-postgresql",
  GROCY = "grocy",
  HEIMDALL = "heimdall",
  HOMEPAGE = "homepage",
  JELLYFIN = "jellyfin",
  KUZZLE = "kuzzle",
  LISTMONK = "listmonk",
  LOGTO = "logto",
  MEDIAWIKI = "mediawiki",
  MEILISEARCH = "meilisearch",
  METABASE = "metabase",
  METUBE = "metube",
  MINIO = "minio",
  MOODLE = "moodle",
  N8N = "n8n",
  N8N_WITH_POSTGRESQL = "n8n-with-postgresql",
  NEXT_IMAGE_TRANSFORMATION = "next-image-transformation",
  NEXTCLOUD = "nextcloud",
  NOCODB = "nocodb",
  ODOO = "odoo",
  OPENBLOCKS = "openblocks",
  PAIRDROP = "pairdrop",
  PENPOT = "penpot",
  PHPMYADMIN = "phpmyadmin",
  POCKETBASE = "pocketbase",
  POSTHOG = "posthog",
  REACTIVE_RESUME = "reactive-resume",
  ROCKETCHAT = "rocketchat",
  SHLINK = "shlink",
  SLASH = "slash",
  SNAPDROP = "snapdrop",
  STATUSNOOK = "statusnook",
  STIRLING_PDF = "stirling-pdf",
  SUPABASE = "supabase",
  SYNCTHING = "syncthing",
  TOLGEE = "tolgee",
  TRIGGER = "trigger",
  TRIGGER_WITH_EXTERNAL_DATABASE = "trigger-with-external-database",
  TWENTY = "twenty",
  UMAMI = "umami",
  UNLEASH_WITH_POSTGRESQL = "unleash-with-postgresql",
  UNLEASH_WITHOUT_DATABASE = "unleash-without-database",
  UPTIME_KUMA = "uptime-kuma",
  VAULTWARDEN = "vaultwarden",
  VIKUNJA = "vikunja",
  WEBLATE = "weblate",
  WHOOGLE = "whoogle",
  WORDPRESS_WITH_MARIADB = "wordpress-with-mariadb",
  WORDPRESS_WITH_MYSQL = "wordpress-with-mysql",
  WORDPRESS_WITHOUT_DATABASE = "wordpress-without-database",
}

export const CoolifyServiceMetadataList: Array<
  CoolifyResourceMetadata & { type: CoolifyServices }
> = [
  {
    type: CoolifyServices.ACTIVEPIECES,
    name: "Activepieces",
    description: "Open source no-code business automation.",
    docs: "https://coolify.io/docs/services/activepieces",
  },
  {
    type: CoolifyServices.APPSMITH,
    name: "Appsmith",
    description: "A low-code application platform for building internal tools.",
    docs: "https://coolify.io/docs/services/appsmith",
  },
  {
    type: CoolifyServices.APPWRITE,
    name: "Appwrite",
    description:
      "A backend-as-a-service platform that simplifies the web & mobile app development.",
    docs: "https://coolify.io/docs/services/appwrite",
  },
  {
    type: CoolifyServices.AUTHENTIK,
    name: "Authentik",
    description:
      "An open-source Identity Provider, focused on flexibility and versatility.",
    docs: "https://coolify.io/docs/services/authentik",
  },
  {
    type: CoolifyServices.BABYBUDDY,
    name: "Baby Buddy",
    description:
      "It helps parents track their baby's daily activities, growth, and health with ease.",
    docs: "https://coolify.io/docs/services/baby-buddy",
  },
  {
    type: CoolifyServices.BUDGE,
    name: "BudgE",
    description: "A budgeting personal finance app.",
    docs: "https://coolify.io/docs/services/budge",
  },
  {
    type: CoolifyServices.CHANGEDETECTION,
    name: "Changedetection",
    description: "Website change detection monitor and notifications.",
    docs: "https://coolify.io/docs/services/changedetection",
  },
  {
    type: CoolifyServices.CHATWOOT,
    name: "Chatwoot",
    description: "Open-source customer engagement suite.",
    docs: "https://coolify.io/docs/services/chatwoot",
  },
  {
    type: CoolifyServices.CLASSICPRESS_WITH_MARIADB,
    name: "ClassicPress (with MariaDB)",
    description:
      "A business-focused CMS with a strong community, using MariaDB.",
    docs: "https://coolify.io/docs/services/classicpress",
  },
  {
    type: CoolifyServices.CLASSICPRESS_WITH_MYSQL,
    name: "ClassicPress (with MySQL)",
    description: "A business-focused CMS with a strong community, using MySQL.",
    docs: "https://coolify.io/docs/services/classicpress",
  },
  {
    type: CoolifyServices.CLASSICPRESS_WITHOUT_DATABASE,
    name: "ClassicPress (without database)",
    description:
      "A business-focused CMS with a strong community, no database included.",
    docs: "https://coolify.io/docs/services/classicpress",
  },
  {
    type: CoolifyServices.CLOUDFLARED,
    name: "Cloudflared",
    description: "Cloudflare Tunnel client.",
    docs: "https://coolify.io/docs/services/cloudflared",
  },
  {
    type: CoolifyServices.CODE_SERVER,
    name: "Code Server",
    description:
      "Run VS Code on any machine anywhere and access it in the browser.",
    docs: "https://coolify.io/docs/services/code-server",
  },
  {
    type: CoolifyServices.DASHBOARD,
    name: "Dashboard",
    description: "A simple dashboard for your server.",
    docs: "https://coolify.io/docs/services/dashboard",
  },
  {
    type: CoolifyServices.DIRECTUS,
    name: "Directus",
    description: "An open-source headless CMS and API for custom databases.",
    docs: "https://coolify.io/docs/services/directus",
  },
  {
    type: CoolifyServices.DIRECTUS_WITH_POSTGRESQL,
    name: "Directus (with PostgreSQL)",
    description: "Directus with PostgreSQL as the database.",
    docs: "https://coolify.io/docs/services/directus",
  },
  {
    type: CoolifyServices.DOCKER_REGISTRY,
    name: "Docker Registry",
    description: "A Docker registry to store and manage your Docker images.",
    docs: "https://coolify.io/docs/services/docker-registry",
  },
  {
    type: CoolifyServices.DOCUSEAL,
    name: "Docuseal",
    description: "Open source DocuSign alternative.",
    docs: "https://coolify.io/docs/services/docuseal",
  },
  {
    type: CoolifyServices.DOCUSEAL_WITH_POSTGRES,
    name: "Docuseal (with Postgres)",
    description: "Docuseal with Postgres as the database.",
    docs: "https://coolify.io/docs/services/docuseal",
  },
  {
    type: CoolifyServices.DOKUWIKI,
    name: "DokuWiki",
    description:
      "A simple to use and highly versatile Open Source wiki software that doesn't require a database.",
    docs: "https://coolify.io/docs/services/dokuwiki",
  },
  {
    type: CoolifyServices.DUPLICATI,
    name: "Duplicati",
    description:
      "A free backup client that securely stores encrypted, incremental, compressed backups on cloud storage services and remote file servers.",
    docs: "https://coolify.io/docs/services/duplicati",
  },
  {
    type: CoolifyServices.EMBY,
    name: "Emby",
    description:
      "A media server to organize, play, and stream audio and video to a variety of devices.",
    docs: "https://coolify.io/docs/services/emby",
  },
  {
    type: CoolifyServices.EMBYSTAT,
    name: "Emby Stat",
    description: "A simple and easy-to-use Emby statistics dashboard.",
    docs: "https://coolify.io/docs/services/emby-stat",
  },
  {
    type: CoolifyServices.FIDER,
    name: "Fider",
    description: "An open platform to collect and organize customer feedback.",
    docs: "https://coolify.io/docs/services/fider",
  },
  {
    type: CoolifyServices.FILEBROWSER,
    name: "Filebrowser",
    description: "A file manager for the web.",
    docs: "https://coolify.io/docs/services/filebrowser",
  },
  {
    type: CoolifyServices.FIREFLY,
    name: "Firefly III",
    description: "A personal finances manager.",
    docs: "https://coolify.io/docs/services/firefly-iii",
  },
  {
    type: CoolifyServices.FORMBRICKS,
    name: "Formbricks",
    description: "A form builder for static sites.",
    docs: "https://coolify.io/docs/services/formbricks",
  },
  {
    type: CoolifyServices.GHOST,
    name: "Ghost",
    description: "A professional publishing platform.",
    docs: "https://coolify.io/docs/services/ghost",
  },
  {
    type: CoolifyServices.GITEA,
    name: "Gitea",
    description: "A painless self-hosted Git service.",
    docs: "https://coolify.io/docs/services/gitea",
  },
  {
    type: CoolifyServices.GITEA_WITH_MARIADB,
    name: "Gitea (with MariaDB)",
    description: "Gitea with MariaDB as the database.",
    docs: "https://coolify.io/docs/services/gitea",
  },
  {
    type: CoolifyServices.GITEA_WITH_MYSQL,
    name: "Gitea (with MySQL)",
    description: "Gitea with MySQL as the database.",
    docs: "https://coolify.io/docs/services/gitea",
  },
  {
    type: CoolifyServices.GITEA_WITH_POSTGRESQL,
    name: "Gitea (with PostgreSQL)",
    description: "Gitea with PostgreSQL as the database.",
    docs: "https://coolify.io/docs/services/gitea",
  },
  {
    type: CoolifyServices.GLANCE,
    name: "Glance",
    description: "All-in-one Home Server Dashboard.",
    docs: "https://coolify.io/docs/services/glance",
  },
  {
    type: CoolifyServices.GLANCES,
    name: "Glances",
    description: "Cross-platform system monitoring tool.",
    docs: "https://coolify.io/docs/services/glances",
  },
  {
    type: CoolifyServices.GLITCHTIP,
    name: "GlitchTip",
    description: "An open-source error tracking tool.",
    docs: "https://coolify.io/docs/services/glitchtip",
  },
  {
    type: CoolifyServices.GRAFANA,
    name: "Grafana",
    description: "The open platform for beautiful analytics and monitoring.",
    docs: "https://coolify.io/docs/services/grafana",
  },
  {
    type: CoolifyServices.GRAFANA_WITH_POSTGRESQL,
    name: "Grafana (with PostgreSQL)",
    description: "Grafana with PostgreSQL as the database.",
    docs: "https://coolify.io/docs/services/grafana",
  },
  {
    type: CoolifyServices.GROCY,
    name: "Grocy",
    description:
      "A self-hosted groceries & household management solution for your home.",
    docs: "https://coolify.io/docs/services/grocy",
  },
  {
    type: CoolifyServices.HEIMDALL,
    name: "Heimdall",
    description: "An elegant solution to organize all your web applications.",
    docs: "https://coolify.io/docs/services/heimdall",
  },
  {
    type: CoolifyServices.HOMEPAGE,
    name: "Homepage",
    description: "A modern homepage for your server.",
    docs: "https://coolify.io/docs/services/homepage",
  },
  {
    type: CoolifyServices.JELLYFIN,
    name: "Jellyfin",
    description: "The Free Software Media System.",
    docs: "https://coolify.io/docs/services/jellyfin",
  },
  {
    type: CoolifyServices.KUZZLE,
    name: "Kuzzle",
    description:
      "A powerful backend that enables you to build modern apps faster.",
    docs: "https://coolify.io/docs/services/kuzzle",
  },
  {
    type: CoolifyServices.LISTMONK,
    name: "Listmonk",
    description: "Self-hosted newsletter and mailing list manager.",
    docs: "https://coolify.io/docs/services/listmonk",
  },
  {
    type: CoolifyServices.LOGTO,
    name: "Logto",
    description:
      "Logto is an Auth0 alternative designed for modern apps and SaaS products.",
    docs: "https://coolify.io/docs/services/logto",
  },
  {
    type: CoolifyServices.MEDIAWIKI,
    name: "MediaWiki",
    description: "A free and open-source wiki software package.",
    docs: "https://coolify.io/docs/services/mediawiki",
  },
  {
    type: CoolifyServices.MEILISEARCH,
    name: "Meilisearch",
    description:
      "A powerful, fast, open-source, easy to use, and deploy search engine.",
    docs: "https://coolify.io/docs/services/meilisearch",
  },
  {
    type: CoolifyServices.METABASE,
    name: "Metabase",
    description:
      "The simplest, fastest way to share data and analytics inside your company.",
    docs: "https://coolify.io/docs/services/metabase",
  },
  {
    type: CoolifyServices.METUBE,
    name: "Metube",
    description: "A self-hosted video sharing platform.",
    docs: "https://coolify.io/docs/services/metube",
  },
  {
    type: CoolifyServices.MINIO,
    name: "MinIO",
    description: "A high-performance, distributed object storage system.",
    docs: "https://coolify.io/docs/services/minio",
  },
  {
    type: CoolifyServices.MOODLE,
    name: "Moodle",
    description: "Open-source learning platform.",
    docs: "https://coolify.io/docs/services/moodle",
  },
  {
    type: CoolifyServices.N8N,
    name: "N8N",
    description: "Workflow automation tool.",
    docs: "https://coolify.io/docs/services/n8n",
  },
  {
    type: CoolifyServices.N8N_WITH_POSTGRESQL,
    name: "N8N (with PostgreSQL)",
    description: "N8N with PostgreSQL as the database.",
    docs: "https://coolify.io/docs/services/n8n",
  },
  {
    type: CoolifyServices.NEXT_IMAGE_TRANSFORMATION,
    name: "Next Image Transformation",
    description: "Image transformation for Next.js apps.",
    docs: "https://coolify.io/docs/services/next-image-transformation",
  },
  {
    type: CoolifyServices.NEXTCLOUD,
    name: "Nextcloud",
    description: "A safe home for all your data.",
    docs: "https://coolify.io/docs/services/nextcloud",
  },
  {
    type: CoolifyServices.NOCODB,
    name: "NocoDB",
    description: "Open Source Airtable Alternative.",
    docs: "https://coolify.io/docs/services/nocodb",
  },
  {
    type: CoolifyServices.ODOO,
    name: "Odoo",
    description: "Open source ERP and CRM.",
    docs: "https://coolify.io/docs/services/odoo",
  },
  {
    type: CoolifyServices.OPENBLOCKS,
    name: "Openblocks",
    description: "Open-source low code platform.",
    docs: "https://coolify.io/docs/services/openblocks",
  },
  {
    type: CoolifyServices.PAIRDROP,
    name: "Pairdrop",
    description: "Local file sharing in your browser.",
    docs: "https://coolify.io/docs/services/pairdrop",
  },
  {
    type: CoolifyServices.PENPOT,
    name: "Penpot",
    description: "Open Source design & prototyping platform.",
    docs: "https://coolify.io/docs/services/penpot",
  },
  {
    type: CoolifyServices.PHPMYADMIN,
    name: "phpMyAdmin",
    description: "MySQL database management tool.",
    docs: "https://coolify.io/docs/services/phpmyadmin",
  },
  {
    type: CoolifyServices.POCKETBASE,
    name: "Pocketbase",
    description: "Open Source backend for your next SaaS and Mobile app.",
    docs: "https://coolify.io/docs/services/pocketbase",
  },
  {
    type: CoolifyServices.POSTHOG,
    name: "PostHog",
    description: "Open source product analytics.",
    docs: "https://coolify.io/docs/services/posthog",
  },
  {
    type: CoolifyServices.REACTIVE_RESUME,
    name: "Reactive Resume",
    description: "A free and open source resume builder.",
    docs: "https://coolify.io/docs/services/reactive-resume",
  },
  {
    type: CoolifyServices.ROCKETCHAT,
    name: "Rocket.Chat",
    description: "Open source team chat software.",
    docs: "https://coolify.io/docs/services/rocketchat",
  },
  {
    type: CoolifyServices.SHLINK,
    name: "Shlink",
    description: "The open source URL shortener.",
    docs: "https://coolify.io/docs/services/shlink",
  },
  {
    type: CoolifyServices.SLASH,
    name: "Slash",
    description: "Open-source, self-hosted links and notes manager.",
    docs: "https://coolify.io/docs/services/slash",
  },
  {
    type: CoolifyServices.SNAPDROP,
    name: "Snapdrop",
    description: "Local file sharing in your browser.",
    docs: "https://coolify.io/docs/services/snapdrop",
  },
  {
    type: CoolifyServices.STATUSNOOK,
    name: "Statusnook",
    description: "A status page system for your website.",
    docs: "https://coolify.io/docs/services/statusnook",
  },
  {
    type: CoolifyServices.STIRLING_PDF,
    name: "Stirling PDF",
    description: "Powerful PDF manipulation tool.",
    docs: "https://coolify.io/docs/services/stirling-pdf",
  },
  {
    type: CoolifyServices.SUPABASE,
    name: "Supabase",
    description: "Open source Firebase alternative.",
    docs: "https://coolify.io/docs/services/supabase",
  },
  {
    type: CoolifyServices.SYNCTHING,
    name: "Syncthing",
    description: "Open Source Continuous File Synchronization.",
    docs: "https://coolify.io/docs/services/syncthing",
  },
  {
    type: CoolifyServices.TOLGEE,
    name: "Tolgee",
    description: "Open source localization platform.",
    docs: "https://coolify.io/docs/services/tolgee",
  },
  {
    type: CoolifyServices.TRIGGER,
    name: "Trigger",
    description: "Open-source workflow automation tool.",
    docs: "https://coolify.io/docs/services/trigger",
  },
  {
    type: CoolifyServices.TRIGGER_WITH_EXTERNAL_DATABASE,
    name: "Trigger (with external database)",
    description: "Trigger with external database support.",
    docs: "https://coolify.io/docs/services/trigger",
  },
  {
    type: CoolifyServices.TWENTY,
    name: "Twenty",
    description: "[Description not available]",
    docs: "https://coolify.io/docs/services/twenty",
  },
  {
    type: CoolifyServices.UMAMI,
    name: "Umami",
    description:
      "Simple, fast, privacy-focused alternative to Google Analytics.",
    docs: "https://coolify.io/docs/services/umami",
  },
  {
    type: CoolifyServices.UNLEASH_WITH_POSTGRESQL,
    name: "Unleash (with PostgreSQL)",
    description: "Unleash with PostgreSQL as the database.",
    docs: "https://coolify.io/docs/services/unleash",
  },
  {
    type: CoolifyServices.UNLEASH_WITHOUT_DATABASE,
    name: "Unleash (without database)",
    description: "Unleash without a database.",
    docs: "https://coolify.io/docs/services/unleash",
  },
  {
    type: CoolifyServices.UPTIME_KUMA,
    name: "Uptime Kuma",
    description: "A fancy self-hosted monitoring tool.",
    docs: "https://coolify.io/docs/services/uptime-kuma",
  },
  {
    type: CoolifyServices.VAULTWARDEN,
    name: "Vaultwarden",
    description: "Unofficial Bitwarden compatible server.",
    docs: "https://coolify.io/docs/services/vaultwarden",
  },
  {
    type: CoolifyServices.VIKUNJA,
    name: "Vikunja",
    description: "The open-source to-do app.",
    docs: "https://coolify.io/docs/services/vikunja",
  },
  {
    type: CoolifyServices.WEBLATE,
    name: "Weblate",
    description: "Web-based translation tool.",
    docs: "https://coolify.io/docs/services/weblate",
  },
  {
    type: CoolifyServices.WHOOGLE,
    name: "Whoogle",
    description: "Self-hosted, ad-free, privacy-respecting metasearch engine.",
    docs: "https://coolify.io/docs/services/whoogle",
  },
  {
    type: CoolifyServices.WORDPRESS_WITH_MARIADB,
    name: "WordPress (with MariaDB)",
    description: "Website and blogging platform with MariaDB.",
    docs: "https://coolify.io/docs/services/wordpress",
  },
  {
    type: CoolifyServices.WORDPRESS_WITH_MYSQL,
    name: "WordPress (with MySQL)",
    description: "Website and blogging platform with MySQL.",
    docs: "https://coolify.io/docs/services/wordpress",
  },
  {
    type: CoolifyServices.WORDPRESS_WITHOUT_DATABASE,
    name: "WordPress (without database)",
    description: "Website and blogging platform without a database.",
    docs: "https://coolify.io/docs/services/wordpress",
  },
];
