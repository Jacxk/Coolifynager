import { iconWithClassName } from "@/lib/iconWithClassName";
import type { LucideIcon } from "lucide-react-native";
import { ChevronRight as LucideChevronRight } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideChevronRight);
const ChevronRight = (props: React.ComponentProps<LucideIcon>) => (
  <LucideChevronRight
    className={props.className ?? "text-foreground"}
    {...props}
  />
);
export { ChevronRight };
