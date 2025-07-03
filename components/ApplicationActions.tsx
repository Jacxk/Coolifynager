import { Pause } from "@/components/icons/Pause";
import { RotateCw } from "@/components/icons/RotateCw";
import { RotateCwSquare } from "@/components/icons/RotateCwSquare";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { View } from "react-native";

export interface ApplicationActionsProps {
  className?: string;
  onRedeploy?: () => void;
  onRestart?: () => void;
  onStop?: () => void;
}

export function ApplicationActions({
  className,
  onRedeploy,
  onRestart,
  onStop,
}: ApplicationActionsProps) {
  return (
    <View className={cn("flex flex-row gap-2 self-end", className)}>
      <Button
        size="icon"
        variant="ghost"
        aria-label="Redeploy"
        onPress={onRedeploy}
      >
        <RotateCwSquare className="text-orange-500" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        aria-label="Restart"
        onPress={onRestart}
      >
        <RotateCw className="text-yellow-500" />
      </Button>
      <Button size="icon" variant="ghost" aria-label="Stop" onPress={onStop}>
        <Pause className="text-red-500" />
      </Button>
    </View>
  );
}
