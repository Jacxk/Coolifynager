import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Text, type TextProps, View, type ViewProps } from "react-native";

const cardVariants = cva(
  "rounded-lg border border-border bg-card shadow-sm shadow-foreground/10",
  {
    variants: {
      variant: {
        default: "",
        destructive:
          "ios:border-l-red-500 ios:border-l-4 android:bg-red-500/20",
        success:
          "ios:border-l-green-500 ios:border-l-4 android:bg-green-500/20",
        info: "ios:border-l-yellow-500 ios:border-l-4 android:bg-yellow-500/20",
        ghost:
          "ios:border-l-foreground ios:border-l-4 android:bg-foreground/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type CardProps = ViewProps &
  VariantProps<typeof cardVariants> & {
    ref?: React.RefObject<View>;
  };

function Card({ className, variant, ...props }: CardProps) {
  return (
    <View className={cn(cardVariants({ variant, className }))} {...props} />
  );
}

function CardHeader({
  className,
  ...props
}: ViewProps & {
  ref?: React.RefObject<View>;
}) {
  return (
    <View
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
}

function CardTitle({
  className,
  ...props
}: TextProps & {
  ref?: React.RefObject<Text>;
}) {
  return (
    <Text
      role="heading"
      aria-level={3}
      className={cn(
        "text-2xl text-card-foreground font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: TextProps & {
  ref?: React.RefObject<Text>;
}) {
  return (
    <Text
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardContent({
  className,
  ...props
}: ViewProps & {
  ref?: React.RefObject<View>;
}) {
  return (
    <TextClassContext.Provider value="text-card-foreground">
      <View className={cn("p-6 pt-0", className)} {...props} />
    </TextClassContext.Provider>
  );
}

function CardFooter({
  className,
  ...props
}: ViewProps & {
  ref?: React.RefObject<View>;
}) {
  return (
    <View
      className={cn("flex flex-row items-center p-6 pt-0", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
