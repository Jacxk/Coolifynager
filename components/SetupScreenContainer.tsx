import { KeyboardAvoidingView, Platform } from "react-native";

export default function SetupScreenContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center p-8 gap-4"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
