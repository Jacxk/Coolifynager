export type Deployment = {
  id: number;
  application_id: string;
  deployment_uuid: string;
  pull_request_id: number;
  force_rebuild: boolean;
  commit: string;
  status: string;
  is_webhook: boolean;
  is_api: boolean;
  created_at: string;
  updated_at: string;
  finished_at: string;
  logs: string;
  current_process_id: string;
  restart_only: boolean;
  git_type: string;
  server_id: number;
  application_name: string;
  server_name: string;
  deployment_url: string;
  destination_id: string;
  only_this_server: boolean;
  rollback: boolean;
  commit_message: string;
  build_server_id: number;
  horizon_job_id: string;
  horizon_job_worker: string;
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
  command?: string;
  output: string;
  type: string;
  timestamp: string;
  hidden: boolean;
  batch: number;
  order?: number;
};
