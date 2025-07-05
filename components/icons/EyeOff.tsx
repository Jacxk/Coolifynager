import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { EyeOff as LucideEyeOff } from "lucide-react-native";
import React from "react";

iconWithClassName(LucideEyeOff);

const EyeOff = (props: React.ComponentProps<LucideIcon>) => (
  <LucideEyeOff className={cn("text-foreground", props.className)} {...props} />
);

export { EyeOff };
