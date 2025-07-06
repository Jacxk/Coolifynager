export const StatusText = {
  deployment: (status: string | undefined) => {
    switch (status) {
      case "finished":
        return "Finished";
      case "in_progress":
        return "In Progress";
      case "cancelled-by-user":
        return "Cancelled by User";
      case "failed":
        return "Failed";
      default:
        return status;
    }
  },
};
