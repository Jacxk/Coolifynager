import { Pause } from "@/components/icons/Pause";
import { RotateCw } from "@/components/icons/RotateCw";
import { RotateCwSquare } from "@/components/icons/RotateCwSquare";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { View } from "react-native";
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
}

interface RedeployActionProps {
  onRedeploy?: () => void;
}

interface StopActionProps {
  onStop?: () => void;
}

type ApplicationActionsProps = {
  className?: string;
} & RestartActionProps &
  RedeployActionProps &
  StopActionProps;

function RestartAction({ onRestart }: RestartActionProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Restart">
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
          <Button onPress={onRestart}>
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

function StopAction({ onStop }: StopActionProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Stop">
          <Pause className="text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="m-4">
        <DialogHeader>
          <DialogTitle>Stop Application</DialogTitle>
          <DialogDescription>
            Do you want to stop this application?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-2 self-end">
          <DialogClose asChild>
            <Button variant="secondary">
              <Text>Cancel</Text>
            </Button>
          </DialogClose>
          <Button onPress={onStop}>
            <Text>Stop</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ApplicationActions({
  className,
  onRedeploy,
  onRestart,
  onStop,
}: ApplicationActionsProps) {
  return (
    <View className={cn("flex flex-row gap-2", className)}>
      <RedeployAction onRedeploy={onRedeploy} />
      <RestartAction onRestart={onRestart} />
      <StopAction onStop={onStop} />
    </View>
  );
}
