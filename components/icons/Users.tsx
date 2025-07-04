import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { Users as LucideUsers } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideUsers);
const Users = (props: React.ComponentProps<LucideIcon>) => (
  <LucideUsers className={cn("text-foreground", props.className)} {...props} />
);
export { Users };
