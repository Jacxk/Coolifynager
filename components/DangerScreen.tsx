import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { SafeView } from "./SafeView";
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
import { Button } from "./ui/button";
import { H1, H3 } from "./ui/typography";

// TODO: Add delete action
export default function DangerScreen() {
  return (
    <SafeView className="gap-4">
      <View>
        <H1>Danger Zone</H1>
        <Text className="text-muted-foreground">
          Woah. I hope you know what are you doing.
        </Text>
      </View>
      <View>
        <H3>Delete Resource</H3>
        <Text className="text-muted-foreground">
          This will stop your containers, delete all related data, etc. Beware!
          There is no coming back!
        </Text>
      </View>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            <Text>Delete</Text>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to delete this resource? This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-2 self-end">
            <AlertDialogCancel>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction>
              <Text>Delete</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SafeView>
  );
}
