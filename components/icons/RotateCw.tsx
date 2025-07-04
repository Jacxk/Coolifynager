import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { RotateCw as LucideRotateCw } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideRotateCw);
const RotateCw = (props: React.ComponentProps<LucideIcon>) => (
  <LucideRotateCw
    className={cn("text-foreground", props.className)}
    {...props}
  />
);
export { RotateCw };
