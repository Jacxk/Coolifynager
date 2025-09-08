import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { Moon as LucideMoon } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideMoon);
const Moon = (props: React.ComponentProps<LucideIcon>) => (
  <LucideMoon className={cn("text-foreground", props.className)} {...props} />
);
export { Moon };
