import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { Settings as LucideSettings } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideSettings);
const SettingsIcon = (props: React.ComponentProps<LucideIcon>) => (
  <LucideSettings
    className={cn("text-foreground", props.className)}
    {...props}
  />
);
export { SettingsIcon };
