import { Pause } from "@/components/icons/Pause";
import { Play } from "@/components/icons/Play";
import { RotateCw } from "@/components/icons/RotateCw";
import { RotateCwSquare } from "@/components/icons/RotateCwSquare";
import { X } from "@/components/icons/X";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Terminal } from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Loader2 } from "../icons/Loader2";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Text } from "../ui/text";

type RestartActionProps = {
  onRestart?: () => void;
  disabled?: boolean;
  resourceType: string;
};

type RedeployActionProps = {
  onRedeploy?: () => void;
  resourceType: string;
};

type StopActionProps = {
  onStop?: () => void;
  disabled?: boolean;
  resourceType: string;
};

type StartActionProps = {
  onStart?: () => void;
  disabled?: boolean;
  resourceType: string;
};

type ResourceActionsProps = {
  className?: string;
  isRunning?: boolean;
  stopDisabled?: boolean;
  restartDisabled?: boolean;
  isDeploying?: boolean;
  resourceType: "application" | "service" | "database";
  showDeploy?: boolean;
} & RestartActionProps &
  RedeployActionProps &
  StopActionProps &
  StartActionProps;

function RestartAction({
  onRestart,
  disabled,
  resourceType,
}: RestartActionProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Pressable aria-label="Restart" disabled={disabled} hitSlop={5}>
          <RotateCw className="text-yellow-500" />
        </Pressable>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restart {resourceType}</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to restart this {resourceType}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row gap-2 self-end">
          <AlertDialogCancel disabled={disabled}>
            <Text>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction onPress={onRestart} disabled={disabled}>
            <Text>Restart</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function RedeployAction({ onRedeploy, resourceType }: RedeployActionProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Pressable aria-label="Redeploy" hitSlop={5}>
          <RotateCwSquare className="text-orange-500" />
        </Pressable>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Redeploy {resourceType}</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to redeploy this {resourceType}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row gap-2 self-end">
          <AlertDialogCancel>
            <Text>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction onPress={onRedeploy}>
            <Text>Redeploy</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function StopAction({ onStop, disabled, resourceType }: StopActionProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Pressable aria-label="Stop" hitSlop={5} disabled={disabled}>
          <Pause className="text-red-500" />
        </Pressable>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm {resourceType} Stopping?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <Alert icon={Terminal} variant="destructive">
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This operation is permanent and cannot be undone. Please think
                again before proceeding!
              </AlertDescription>
            </Alert>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Text className="text-muted-foreground">
          The following actions will be performed:
        </Text>
        <View className="flex flex-row">
          <X className="text-red-500" />
          <Text className="text-red-500">
            This {resourceType} will be stopped.
          </Text>
        </View>
        <View className="flex flex-row">
          <X className="text-red-500" />
          <Text className="text-red-500">
            All non-persistent data of this {resourceType} will be deleted.
          </Text>
        </View>
        <AlertDialogFooter className="flex flex-row gap-2 self-end">
          <AlertDialogCancel disabled={disabled}>
            <Text>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction onPress={onStop} disabled={disabled}>
            <Text>Confirm</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function StartAction({ onStart, disabled, resourceType }: StartActionProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Start"
          disabled={disabled}
        >
          <Play className="text-green-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Start {resourceType}</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to start this {resourceType}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row gap-2 self-end">
          <AlertDialogCancel disabled={disabled}>
            <Text>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction onPress={onStart} disabled={disabled}>
            <Text>Start</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ResourceActions({
  className,
  isRunning,
  stopDisabled,
  restartDisabled,
  isDeploying,
  resourceType,
  showDeploy = false,
  onRedeploy,
  onRestart,
  onStop,
  onStart,
}: ResourceActionsProps) {
  const sv = useSharedValue<number>(0);

  useEffect(() => {
    sv.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.linear }),
      -1
    );
  }, []);

  const rotationAnimation = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sv.value * 360}deg` }],
  }));

  // For applications with deployments, show "deploying" state
  if (isDeploying && resourceType === "application") {
    return (
      <View className={cn("flex flex-row gap-2", className)}>
        <Button size="icon" variant="ghost" aria-label="Deploying">
          <Animated.View style={rotationAnimation}>
            <Loader2 />
          </Animated.View>
        </Button>
      </View>
    );
  }

  return (
    <View className={cn("flex flex-row gap-4", className)}>
      {isRunning ? (
        <>
          {showDeploy && (
            <RedeployAction
              onRedeploy={onRedeploy}
              resourceType={resourceType}
            />
          )}
          <RestartAction
            onRestart={onRestart}
            disabled={restartDisabled}
            resourceType={resourceType}
          />
          <StopAction
            onStop={onStop}
            disabled={stopDisabled}
            resourceType={resourceType}
          />
        </>
      ) : (
        <StartAction
          onStart={onStart}
          disabled={isDeploying}
          resourceType={resourceType}
        />
      )}
    </View>
  );
}
