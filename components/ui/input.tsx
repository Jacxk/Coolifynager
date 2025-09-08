import { Eye } from "@/components/icons/Eye";
import { EyeOff } from "@/components/icons/EyeOff";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";

function Input({
  className,
  placeholderClassName,
  icon,
  ...props
}: TextInputProps & {
  ref?: React.RefObject<TextInput>;
  icon?: React.ReactElement;
}) {
  const textInputProps = {
    className: cn(
      "h-12 text-[1.1rem] text-foreground placeholder:text-muted-foreground",
      { "opacity-50": props.editable === false },
      className
    ),
    placeholderClassName: cn("text-muted", placeholderClassName),
    ...props,
  };

  return (
    <View className="w-full flex flex-row items-center border border-input rounded-md px-3 bg-background gap-2">
      {icon &&
        React.cloneElement(icon, {
          // @ts-ignore
          className: "text-muted-foreground",
          size: 16,
        })}
      <TextInput
        {...textInputProps}
        className={cn("flex-1", textInputProps.className)}
        clearButtonMode="always"
      />
    </View>
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
