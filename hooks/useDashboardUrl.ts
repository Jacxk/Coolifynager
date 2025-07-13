import { Secrets } from "@/constants/Secrets";
import SecureStore from "@/utils/SecureStorage";
import { useLayoutEffect, useState } from "react";

export default function useDashboardUrl() {
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);

  useLayoutEffect(() => {
    SecureStore.getItemAsync(Secrets.SERVER_ADDRESS).then((serverAddress) => {
      if (serverAddress) {
        setDashboardUrl(`${serverAddress}`);
      }
    });
  }, []);

  return dashboardUrl;
}
