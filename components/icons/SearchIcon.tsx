import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { SearchIcon as LucideSearchIcon } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideSearchIcon);
const SearchIcon = (props: React.ComponentProps<LucideIcon>) => (
  <LucideSearchIcon
    className={cn("text-foreground", props.className)}
    {...props}
  />
);
export { SearchIcon };
