import { cn } from "@/lib/utils";
import * as SplashScreen from "expo-splash-screen";
import { KeyboardAvoidingView, ScrollView } from "react-native";

export default function SetupScreenContainer({
  children,
  scrollviewClassName,
}: {
  children: React.ReactNode;
  scrollviewClassName?: string;
}) {
  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center p-8 gap-4 bg-branding"
      behavior="padding"
      onLayout={() => {
        SplashScreen.hide();
      }}
    >
      <ScrollView
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName={cn(
          "flex-1 justify-center gap-2",
          scrollviewClassName,
        )}
        bounces={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
