export const StatusText = {
  deployment: (status: string | undefined) => {
    switch (status) {
      case "finished":
        return "Finished";
      case "in_progress":
        return "In Progress";
      case "cancelled-by-user":
        return "Cancelled";
      case "failed":
        return "Failed";
      case "queued":
        return "Queued";
      default:
        return status;
    }
  },
  resource: (status: string | undefined) => {
    switch (status) {
      case "running:healthy":
        return "Running (Healthy)";
      case "running:unhealthy":
        return "Running (Unhealthy)";
      case "exited:unhealthy":
        return "Stopped";
      default:
        return status;
    }
  },
};
