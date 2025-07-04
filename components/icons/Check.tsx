import { iconWithClassName } from "@/lib/iconWithClassName";
import type { LucideIcon } from "lucide-react-native";
import { Check as LucideCheck } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideCheck);
const Check = (props: React.ComponentProps<LucideIcon>) => (
  <LucideCheck className={props.className ?? "text-foreground"} {...props} />
);
export { Check };
