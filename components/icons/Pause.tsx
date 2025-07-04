import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { Pause as LucidePause } from "lucide-react-native";
import React from "react";
iconWithClassName(LucidePause);
const Pause = (props: React.ComponentProps<LucideIcon>) => (
  <LucidePause className={cn("text-foreground", props.className)} {...props} />
);
export { Pause };
