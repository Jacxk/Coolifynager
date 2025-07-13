import { Eye } from "@/components/icons/Eye";
import { EyeOff } from "@/components/icons/EyeOff";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";

function Input({
  className,
  placeholderClassName,
  secureTextEntry,
  ...props
}: TextInputProps & {
  ref?: React.RefObject<TextInput>;
}) {
  const [show, setShow] = React.useState(false);
  const isPassword = !!secureTextEntry;

  if (!isPassword) {
    // Render plain input for non-password fields
    return (
      <TextInput
        className={cn(
          "web:flex h-10 native:h-12 web:w-full rounded-md border border-input bg-background px-3 web:py-2 text-[16px] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
          props.editable === false && "opacity-50 web:cursor-not-allowed",
          className
        )}
        placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
        {...props}
      />
    );
  }

  return (
    <View className="relative w-full">
      <TextInput
        className={cn(
          "web:flex h-12 web:w-full rounded-md border border-input bg-background px-3 web:py-2 text-[16px] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
          props.editable === false && "opacity-50 web:cursor-not-allowed",
          "pr-12",
          className
        )}
        placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
        secureTextEntry={!show}
        importantForAutofill="no"
        {...props}
      />
      <Pressable
        onPress={() => setShow((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
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

export { Input };
