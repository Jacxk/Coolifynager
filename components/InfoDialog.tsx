import Info from "@/components/icons/Info";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import React from "react";

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
  iconClassName = "text-yellow-500 ml-2",
  triggerAccessibilityLabel = "Info",
  label,
}: InfoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger className="flex-row items-center">
        {label &&
          (typeof label === "string" ? (
            <Text className="text-muted-foreground">{label}</Text>
          ) : (
            label
          ))}
        <Info
          className={iconClassName}
          size={iconSize}
          accessibilityLabel={triggerAccessibilityLabel}
        />
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
