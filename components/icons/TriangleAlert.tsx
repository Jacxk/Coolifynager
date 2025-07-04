import { iconWithClassName } from "@/lib/iconWithClassName";
import type { LucideIcon } from "lucide-react-native";
import { TriangleAlert as LucideTriangleAlert } from "lucide-react-native";
import React from "react";

iconWithClassName(LucideTriangleAlert);

const TriangleAlert = (props: React.ComponentProps<LucideIcon>) => (
  <LucideTriangleAlert
    className={props.className ?? "text-foreground"}
    {...props}
  />
);

export { TriangleAlert };
