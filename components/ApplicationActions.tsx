import { Pause } from "@/components/icons/Pause";
import { Play } from "@/components/icons/Play";
import { RotateCw } from "@/components/icons/RotateCw";
import { RotateCwSquare } from "@/components/icons/RotateCwSquare";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Terminal, X } from "lucide-react-native";
import { View } from "react-native";
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

interface StartActionProps {
  onStart?: () => void;
  disabled?: boolean;
}

type ApplicationActionsProps = {
  className?: string;
  isRunning?: boolean;
  onStart?: () => void;
  startDisabled?: boolean;
  stopDisabled?: boolean;
  restartDisabled?: boolean;
} & RestartActionProps &
  RedeployActionProps &
  StopActionProps;

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

function StartAction({ onStart, disabled }: StartActionProps) {
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
          <AlertDialogTitle>Start Application</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to start this application?
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

export function ApplicationActions({
  className,
  isRunning,
  startDisabled,
  stopDisabled,
  restartDisabled,
  onRedeploy,
  onRestart,
  onStop,
  onStart,
}: ApplicationActionsProps) {
  return (
    <View className={cn("flex flex-row gap-2", className)}>
      {isRunning ? (
        <>
          <RedeployAction onRedeploy={onRedeploy} />
          <RestartAction onRestart={onRestart} disabled={restartDisabled} />
          <StopAction onStop={onStop} disabled={stopDisabled} />
        </>
      ) : (
        <StartAction onStart={onStart} disabled={startDisabled} />
      )}
    </View>
  );
}
