import { cn } from "@/lib/utils";
import * as React from "react";
import { View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SafeViewProps extends ViewProps {
  topInset?: boolean;
  bottomInset?: boolean;
  className?: string;
}

export function SafeView(
  {
    topInset = false,
    bottomInset = true,
    className,
    style,
    ...props
  }: SafeViewProps & { ref?: React.Ref<View> },
  ref?: React.Ref<View>
) {
  const inset = useSafeAreaInsets();
  return (
    <View
      ref={ref}
      className={cn("flex-1 p-4", className)}
      style={[
        style,
        {
          ...(topInset ? { paddingTop: inset.top } : {}),
          ...(bottomInset ? { paddingBottom: inset.bottom } : {}),
        },
      ]}
      {...props}
    />
  );
}
