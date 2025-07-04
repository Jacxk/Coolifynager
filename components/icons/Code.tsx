import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { Code as LucideCode } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideCode);
const Code = (props: React.ComponentProps<LucideIcon>) => (
  <LucideCode className={cn("text-foreground", props.className)} {...props} />
);
export { Code };
