import { useApplicationLogs } from "@/api/application";
import { ResourceLogs } from "@/components/resource/ResourceLogs";
import { SafeView } from "@/components/SafeView";

export default function ApplicationLogs() {
  return (
    <SafeView topInset bottomInset={false}>
      <ResourceLogs logsFetcher={useApplicationLogs} />
    </SafeView>
  );
}
