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
  title: string;
  description?: string | React.ReactNode;
  children?: React.ReactNode;
  iconSize?: number;
  iconClassName?: string;
  triggerAccessibilityLabel?: string;
};

export default function InfoDialog({
  title,
  description,
  children,
  iconSize = 18,
  iconClassName = "text-yellow-500 ml-2",
  triggerAccessibilityLabel = "Info",
}: InfoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Info
          className={iconClassName}
          size={iconSize}
          accessibilityLabel={triggerAccessibilityLabel}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
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
