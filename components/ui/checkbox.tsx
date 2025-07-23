import { Check } from "@/components/icons/Check";
import { cn } from "@/lib/utils";
import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import * as Slot from "@rn-primitives/slot";
import * as React from "react";
import { Platform, Pressable, Text, View } from "react-native";

type CheckboxContextType = {
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

const CheckboxContext = React.createContext<CheckboxContextType>({});

type CheckboxRootProps = CheckboxPrimitive.RootProps & {
  children?: React.ReactNode;
  className?: string;
};

function CheckboxRoot({
  className,
  children,
  checked,
  disabled,
  onCheckedChange,
}: CheckboxRootProps) {
  const contextValue = React.useMemo(
    () => ({ checked, onCheckedChange, disabled }),
    [checked, onCheckedChange, disabled]
  );

  return (
    <CheckboxContext.Provider value={contextValue}>
      <View className={cn("flex flex-row items-center gap-4", className)}>
        {children}
      </View>
    </CheckboxContext.Provider>
  );
}

type CheckboxLabelProps = {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  asChild?: boolean;
  asCheckbox?: boolean;
};

function CheckboxLabel({
  onPress,
  asChild = false,
  asCheckbox = true,
  ...props
}: CheckboxLabelProps) {
  const { checked, disabled, onCheckedChange } =
    React.useContext(CheckboxContext);

  const Component = onPress || asCheckbox ? Pressable : View;
  const handlePress = () => {
    if (disabled) return;
    onCheckedChange?.(!checked);
    onPress?.();
  };

  const Children = asChild ? Slot.View : Text;

  return (
    <Component onPress={handlePress} disabled={disabled} hitSlop={6}>
      <Children
        className={cn("text-muted-foreground", props.className)}
        {...props}
      />
    </Component>
  );
}

type CheckboxIconProps = {
  className?: string;
};

function CheckboxIcon({ className }: CheckboxIconProps) {
  const { checked, onCheckedChange, disabled } =
    React.useContext(CheckboxContext);

  return (
    <CheckboxPrimitive.Root
      className={cn(
        "web:peer h-4 w-4 native:h-[20] native:w-[20] shrink-0 rounded-sm native:rounded border border-muted-foreground web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked && "bg-muted-foreground",
        className
      )}
      checked={checked ?? false}
      onCheckedChange={onCheckedChange ?? (() => {})}
      disabled={disabled}
    >
      <CheckboxPrimitive.Indicator
        className={cn("items-center justify-center h-full w-full")}
      >
        <Check
          size={12}
          strokeWidth={Platform.OS === "web" ? 2.5 : 3.5}
          className="text-primary-foreground"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

const Checkbox = Object.assign(CheckboxRoot, {
  Label: CheckboxLabel,
  Action: CheckboxIcon,
});

export { Checkbox, CheckboxIcon, CheckboxLabel, CheckboxRoot };
