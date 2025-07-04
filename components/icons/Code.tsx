import { iconWithClassName } from "@/lib/iconWithClassName";
import type { LucideIcon } from "lucide-react-native";
import { Code as LucideCode } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideCode);
const Code = (props: React.ComponentProps<LucideIcon>) => (
  <LucideCode className={props.className ?? "text-foreground"} {...props} />
);
export { Code };
