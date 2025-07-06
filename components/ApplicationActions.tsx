import { Pause } from "@/components/icons/Pause";
import { Play } from "@/components/icons/Play";
import { RotateCw } from "@/components/icons/RotateCw";
import { RotateCwSquare } from "@/components/icons/RotateCwSquare";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Terminal, X } from "lucide-react-native";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Loader2 } from "./icons/Loader2";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
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
} from "./ui/alert-dialog";
import { Text } from "./ui/text";

interface RestartActionProps {
  onRestart?: () => void;
  disabled?: boolean;
}

interface RedeployActionProps {
  onRedeploy?: () => void;
}

interface StopActionProps {
  onStop?: () => void;
  disabled?: boolean;
}

interface DeployActionProps {
  onDeploy?: () => void;
  disabled?: boolean;
}

type ApplicationActionsProps = {
  className?: string;
  isRunning?: boolean;
  stopDisabled?: boolean;
  restartDisabled?: boolean;
  isDeploying?: boolean;
} & RestartActionProps &
  RedeployActionProps &
  StopActionProps &
  DeployActionProps;

function RestartAction({ onRestart, disabled }: RestartActionProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Restart"
          disabled={disabled}
        >
          <RotateCw className="text-yellow-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restart Application</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to restart this application?
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

function RedeployAction({ onRedeploy }: RedeployActionProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Redeploy">
          <RotateCwSquare className="text-orange-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Redeploy Application</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to redeploy this application?
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

function StopAction({ onStop, disabled }: StopActionProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Stop"
          disabled={disabled}
        >
          <Pause className="text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Application Stopping?</AlertDialogTitle>
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
          <X color="red" />
          <Text className="text-red-500">
            This application will be stopped.
          </Text>
        </View>
        <View className="flex flex-row">
          <X color="red" />
          <Text className="text-red-500">
            All non-persistent data of this application will be deleted.
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

function DeployAction({ onDeploy, disabled }: DeployActionProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Deploy"
          disabled={disabled}
        >
          <Play className="text-green-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deploy Application</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to deploy this application?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row gap-2 self-end">
          <AlertDialogCancel disabled={disabled}>
            <Text>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction onPress={onDeploy} disabled={disabled}>
            <Text>Deploy</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ApplicationActions({
  className,
  isRunning,
  stopDisabled,
  restartDisabled,
  isDeploying,
  onRedeploy,
  onRestart,
  onStop,
  onDeploy,
}: ApplicationActionsProps) {
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

  return (
    <View className={cn("flex flex-row gap-2", className)}>
      {isDeploying ? (
        <Button size="icon" variant="ghost" aria-label="Deploy">
          <Animated.View style={rotationAnimation}>
            <Loader2 />
          </Animated.View>
        </Button>
      ) : isRunning ? (
        <>
          <RedeployAction onRedeploy={onRedeploy} />
          <RestartAction onRestart={onRestart} disabled={restartDisabled} />
          <StopAction onStop={onStop} disabled={stopDisabled} />
        </>
      ) : (
        <DeployAction onDeploy={onDeploy} disabled={isDeploying} />
      )}
    </View>
  );
}
