import { iconWithClassName } from "@/lib/iconWithClassName";
import type { LucideIcon } from "lucide-react-native";
import { Pause as LucidePause } from "lucide-react-native";
import React from "react";
iconWithClassName(LucidePause);
const Pause = (props: React.ComponentProps<LucideIcon>) => (
  <LucidePause className={props.className ?? "text-foreground"} {...props} />
);
export { Pause };
