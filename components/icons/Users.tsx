import { iconWithClassName } from "@/lib/iconWithClassName";
import type { LucideIcon } from "lucide-react-native";
import { Users as LucideUsers } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideUsers);
const Users = (props: React.ComponentProps<LucideIcon>) => (
  <LucideUsers className={props.className ?? "text-foreground"} {...props} />
);
export { Users };
