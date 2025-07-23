import { Eye } from "@/components/icons/Eye";
import { EyeOff } from "@/components/icons/EyeOff";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";

function Input({
  className,
  placeholderClassName,
  ...props
}: TextInputProps & {
  ref?: React.RefObject<TextInput>;
}) {
  return (
    <TextInput
      className={cn(
        "h-12 w-full rounded-md border border-input bg-background px-3 text-[1.1rem] text-foreground",
        { "opacity-50": props.editable === false },
        className
      )}
      placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
      {...props}
    />
  );
}

function PasswordInput({
  className,
  placeholderClassName,
  ...props
}: TextInputProps & {
  ref?: React.RefObject<TextInput>;
}) {
  const [show, setShow] = React.useState(false);

  return (
    <View className="w-full flex flex-row items-center border border-input rounded-md px-3 bg-background">
      <Input
        className="flex-1 border-0 p-0 bg-none"
        secureTextEntry={!show}
        importantForAutofill="no"
        autoComplete="off"
        autoCorrect={false}
        textContentType="none"
        {...props}
      />
      <Pressable
        onPress={() => setShow((prev) => !prev)}
        accessibilityLabel={show ? "Hide password" : "Show password"}
        hitSlop={8}
      >
        {show ? (
          <EyeOff className="w-5 h-5 text-muted-foreground" />
        ) : (
          <Eye className="w-5 h-5 text-muted-foreground" />
        )}
      </Pressable>
    </View>
  );
}

export { Input, PasswordInput };
