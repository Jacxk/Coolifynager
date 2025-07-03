import { iconWithClassName } from "@/lib/iconWithClassName";
import type { LucideIcon } from "lucide-react-native";
import { RotateCwSquare as LucideRotateCwSquare } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideRotateCwSquare);
const RotateCwSquare = (props: React.ComponentProps<LucideIcon>) => (
  <LucideRotateCwSquare
    className={props.className ?? "text-foreground"}
    {...props}
  />
);
export { RotateCwSquare };
