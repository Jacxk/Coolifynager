import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { TriangleAlert as LucideTriangleAlert } from "lucide-react-native";
import React from "react";

iconWithClassName(LucideTriangleAlert);

const TriangleAlert = (props: React.ComponentProps<LucideIcon>) => (
  <LucideTriangleAlert
    className={cn("text-foreground", props.className)}
    {...props}
  />
);

export { TriangleAlert };
