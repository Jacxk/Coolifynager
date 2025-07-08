import { getApplicationLogs } from "@/api/application";
import { ResourceLogs } from "@/components/ResourceLogs";

export default function ApplicationLogs() {
  return <ResourceLogs logsFetcher={getApplicationLogs} />;
}
