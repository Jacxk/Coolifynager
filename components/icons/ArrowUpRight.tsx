import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { ArrowUpRight as LucideArrowUpRight } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideArrowUpRight);
const ArrowUpRight = (props: React.ComponentProps<LucideIcon>) => (
  <LucideArrowUpRight
    className={cn("text-foreground", props.className)}
    {...props}
  />
);
export { ArrowUpRight };
