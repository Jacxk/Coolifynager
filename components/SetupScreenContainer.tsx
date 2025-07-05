import { Keyboard, KeyboardAvoidingView, ScrollView } from "react-native";

export default function SetupScreenContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center p-8 gap-4"
      behavior="padding"
    >
      <ScrollView
        onScrollBeginDrag={Keyboard.dismiss}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="flex-1 justify-center gap-2"
        bounces={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
