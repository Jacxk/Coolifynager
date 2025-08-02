export type Deployment = {
  application_id: string;
  application_name: string;
  build_server_id: string | null;
  commit: string;
  commit_message: string;
  created_at: string;
  current_process_id: string;
  deployment_url: string;
  deployment_uuid: string;
  destination_id: string;
  finished_at: string | null;
  force_rebuild: boolean;
  git_type: string | null;
  horizon_job_id: string;
  horizon_job_worker: string;
  id: number;
  is_api: boolean;
  is_webhook: boolean;
  logs: string;
  only_this_server: boolean;
  pull_request_id: number;
  restart_only: boolean;
  rollback: boolean;
  server_id: number;
  server_name: string;
  status: "queued" | "in_progress" | "failed" | "success" | "finished";
  updated_at: string;
};

export type ApplicationDeployment = {
  count: number;
  deployments: Deployment[];
};

export type DeploymentResponse = {
  deployments: {
    message: string;
    resource_uuid: string;
    deployment_uuid: string;
  }[];
};

export type DeploymentLogData = {
  command: string | null;
  output: string;
  type: string;
  timestamp: string;
  hidden: boolean;
  batch: number;
  order?: number;
};
