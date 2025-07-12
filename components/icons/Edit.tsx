import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { Edit as LucideEdit } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideEdit);
const Edit = (props: React.ComponentProps<LucideIcon>) => (
  <LucideEdit className={cn("text-foreground", props.className)} {...props} />
);
export { Edit };
