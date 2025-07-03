import { cn } from "@/lib/utils";
import * as React from "react";
import { View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SafeViewProps extends ViewProps {
  topInset?: boolean;
  bottomInset?: boolean;
  className?: string;
}

export const SafeView = React.forwardRef<View, SafeViewProps>(
  (
    { topInset = false, bottomInset = true, className, style, ...props },
    ref
  ) => {
    const inset = useSafeAreaInsets();
    return (
      <View
        ref={ref}
        className={cn("flex-1 m-6", className)}
        style={[
          style,
          {
            paddingLeft: inset.left,
            paddingRight: inset.right,
            ...(topInset ? { paddingTop: inset.top } : {}),
            ...(bottomInset ? { paddingBottom: inset.bottom } : {}),
          },
        ]}
        {...props}
      />
    );
  }
);
SafeView.displayName = "SafeView";
