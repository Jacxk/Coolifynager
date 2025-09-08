import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { Trash2 as LucideTrash2 } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideTrash2);
const Trash2 = (props: React.ComponentProps<LucideIcon>) => (
  <LucideTrash2 className={cn("text-foreground", props.className)} {...props} />
);
export { Trash2 };
