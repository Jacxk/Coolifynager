import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import { openBrowserAsync } from "expo-web-browser";
import { View } from "react-native";

type HealthDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  status: string | undefined;
  resourceType: "application" | "service" | "database";
};

export function HealthDialog({
  isOpen,
  onOpenChange,
  status,
  resourceType,
}: HealthDialogProps) {
  const getHealthContent = () => {
    const capitalizedResourceType =
      resourceType.charAt(0).toUpperCase() + resourceType.slice(1);

    switch (status) {
      case "running:unhealthy":
        return {
          title: (
            <View>
              <Text className="text-yellow-500">
                <Text className="text-muted-foreground">Unhealthy state. </Text>
                This doesn't mean that the resource is malfunctioning.
              </Text>
            </View>
          ),
          description: (
            <View>
              <Text className="text-muted-foreground">
                - If the resource is accessible, it indicates that no health
                check is configured - it is not mandatory.
              </Text>
              <Text className="text-muted-foreground">
                - If the resource is not accessible (returning 404 or 503), it
                may indicate that a health check is needed and has not passed.{" "}
                <Text className="text-yellow-500">
                  Your action is required.
                </Text>
              </Text>
              {resourceType === "application" && (
                <Text className="text-muted-foreground mt-4">
                  More details in the{" "}
                  <Text
                    className="text-yellow-500 underline"
                    onPress={() =>
                      openBrowserAsync(
                        "https://coolify.io/docs/knowledge-base/proxy/traefik/healthchecks"
                      )
                    }
                  >
                    documentation
                  </Text>
                  .
                </Text>
              )}
            </View>
          ),
        };
      case "exited:unhealthy":
        return {
          title: `${capitalizedResourceType} is stopped`,
          description: (
            <View>
              <Text className="text-muted-foreground">
                The {resourceType} is not currently running.
              </Text>
            </View>
          ),
        };
      case "running:healthy":
        return {
          title: `${capitalizedResourceType} is running`,
          description: (
            <Text className="text-muted-foreground">
              The {resourceType} is currently running and healthy.
            </Text>
          ),
        };
      default:
        return {
          title: "Health Status Information",
          description: (
            <Text className="text-muted-foreground">
              Current status: {status}
            </Text>
          ),
        };
    }
  };

  const { title, description } = getHealthContent();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">{title}</DialogTitle>
          <DialogDescription asChild>{description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
