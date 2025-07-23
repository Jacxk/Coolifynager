import Info from "@/components/icons/Info";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import React, { useState } from "react";
import { Pressable, View } from "react-native";

type InfoDialogProps = {
  title?: string;
  description?: string | React.ReactNode;
  children?: React.ReactNode;
  iconSize?: number;
  iconClassName?: string;
  triggerAccessibilityLabel?: string;
  label?: string | React.ReactNode;
};

export default function InfoDialog({
  title,
  description,
  children,
  iconSize = 18,
  iconClassName = "text-yellow-500",
  triggerAccessibilityLabel = "Info",
  label,
}: InfoDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <View className="flex-row items-center">
          {label &&
            (typeof label === "string" ? (
              <Text className="text-muted-foreground">{label}</Text>
            ) : (
              label
            ))}
          <Pressable
            className="ml-2"
            onPress={() => setOpen(true)}
            hitSlop={10}
          >
            <Info
              className={iconClassName}
              size={iconSize}
              accessibilityLabel={triggerAccessibilityLabel}
            />
          </Pressable>
        </View>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{title ?? label}</DialogTitle>
        <DialogDescription>
          {typeof description === "string" ? (
            <Text className="text-muted-foreground">{description}</Text>
          ) : (
            description
          )}
        </DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}
