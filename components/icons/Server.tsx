import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { Server as LucideServer } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideServer);
const Server = (props: React.ComponentProps<LucideIcon>) => (
  <LucideServer className={cn("text-foreground", props.className)} {...props} />
);
export { Server };
