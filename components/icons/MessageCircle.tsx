import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { MessageCircle as LucideMessageCircle } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideMessageCircle);
const MessageCircle = (props: React.ComponentProps<LucideIcon>) => (
  <LucideMessageCircle
    className={cn("text-foreground", props.className)}
    {...props}
  />
);
export { MessageCircle };
