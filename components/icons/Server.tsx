import { iconWithClassName } from "@/lib/iconWithClassName";
import type { LucideIcon } from "lucide-react-native";
import { Server as LucideServer } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideServer);
const Server = (props: React.ComponentProps<LucideIcon>) => (
  <LucideServer className={props.className ?? "text-foreground"} {...props} />
);
export { Server };
