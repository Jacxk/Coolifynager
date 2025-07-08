import { getApplicationLogs } from "@/api/application";
import { ResourceLogs } from "@/components/ResourceLogs";
import { SafeView } from "@/components/SafeView";

export default function ApplicationLogs() {
  return (
    <SafeView topInset bottomInset={false}>
      <ResourceLogs logsFetcher={getApplicationLogs} />
    </SafeView>
  );
}
