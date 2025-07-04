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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Restart"
          disabled={disabled}
        >
          <RotateCw className="text-yellow-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="m-4">
        <DialogHeader>
          <DialogTitle>Restart Application</DialogTitle>
          <DialogDescription>
            Do you want to restart this application?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-2 self-end">
          <DialogClose asChild>
            <Button variant="secondary">
              <Text>Cancel</Text>
            </Button>
          </DialogClose>
          <Button onPress={onRestart} disabled={disabled}>
            <Text>Restart</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RedeployAction({ onRedeploy }: RedeployActionProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Redeploy">
          <RotateCwSquare className="text-orange-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="m-4">
        <DialogHeader>
          <DialogTitle>Redeploy Application</DialogTitle>
          <DialogDescription>
            Do you want to redeploy this application?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-2 self-end">
          <DialogClose asChild>
            <Button variant="secondary">
              <Text>Cancel</Text>
            </Button>
          </DialogClose>
          <Button onPress={onRedeploy}>
            <Text>Redeploy</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StopAction({ onStop, disabled }: StopActionProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Stop"
          disabled={disabled}
        >
          <Pause className="text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="m-4">
        <DialogHeader>
          <DialogTitle>Confirm Application Stopping?</DialogTitle>
          <DialogDescription asChild>
            <Alert icon={Terminal} variant="destructive">
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This operation is permanent and cannot be undone. Please think
                again before proceeding!
              </AlertDescription>
            </Alert>
          </DialogDescription>
        </DialogHeader>

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

        <DialogFooter className="flex flex-row gap-2 self-end">
          <DialogClose asChild>
            <Button variant="secondary">
              <Text>Cancel</Text>
            </Button>
          </DialogClose>
          <Button onPress={onStop} disabled={disabled} variant="destructive">
            <Text>Confirm</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StartAction({ onStart, disabled }: StartActionProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Start"
          disabled={disabled}
        >
          <Play className="text-green-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="m-4">
        <DialogHeader>
          <DialogTitle>Start Application</DialogTitle>
          <DialogDescription>
            Do you want to start this application?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-2 self-end">
          <DialogClose asChild>
            <Button variant="secondary">
              <Text>Cancel</Text>
            </Button>
          </DialogClose>
          <Button onPress={onStart} disabled={disabled}>
            <Text>Start</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
