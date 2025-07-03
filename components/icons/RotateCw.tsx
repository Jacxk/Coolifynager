import { iconWithClassName } from "@/lib/iconWithClassName";
import type { LucideIcon } from "lucide-react-native";
import { RotateCw as LucideRotateCw } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideRotateCw);
const RotateCw = (props: React.ComponentProps<LucideIcon>) => (
  <LucideRotateCw className={props.className ?? "text-foreground"} {...props} />
);
export { RotateCw };
