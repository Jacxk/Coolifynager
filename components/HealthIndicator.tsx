import { cn } from "@/lib/utils";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { HealthDialog } from "./HealthDialog";

type HealthIndicatorProps = {
  status: string;
  className?: string;
  iconClassName?: string;
};

export function HealthIndicator({
  status,
  className,
  iconClassName,
}: HealthIndicatorProps) {
  const [isHealthDialogOpen, setIsHealthDialogOpen] = useState(false);

  const healthy_running = ["running:healthy", "running:unknown"].includes(
    status,
  );
  const unhealthy_running = status === "running:unhealthy";
  const unhealthy_exited = ["exited:unhealthy", "exited"].includes(status);

  return (
    <View className={cn("flex-1 items-end justify-center", className)}>
      <Pressable onPress={() => setIsHealthDialogOpen(true)} hitSlop={10}>
        <View
          className={cn("size-4 rounded-full animate-pulse", iconClassName, {
            "bg-red-500 animate-ping": unhealthy_exited,
            "bg-green-500": healthy_running,
            "bg-yellow-500": unhealthy_running,
          })}
        />
      </Pressable>

      <HealthDialog
        isOpen={isHealthDialogOpen}
        onOpenChange={setIsHealthDialogOpen}
        status={status}
        resourceType="application"
      />
    </View>
  );
}
