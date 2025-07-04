import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { Check as LucideCheck } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideCheck);
const Check = (props: React.ComponentProps<LucideIcon>) => (
  <LucideCheck className={cn("text-foreground", props.className)} {...props} />
);
export { Check };
