import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { Database as LucideDatabase } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideDatabase);
const Database = (props: React.ComponentProps<LucideIcon>) => (
  <LucideDatabase
    className={cn("text-foreground", props.className)}
    {...props}
  />
);
export { Database };
