import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { ChevronRight as LucideChevronRight } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideChevronRight);
const ChevronRight = (props: React.ComponentProps<LucideIcon>) => (
  <LucideChevronRight
    className={cn("text-foreground", props.className)}
    {...props}
  />
);
export { ChevronRight };
