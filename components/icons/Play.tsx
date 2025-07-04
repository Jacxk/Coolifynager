import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { Play as LucidePlay } from "lucide-react-native";
import React from "react";

iconWithClassName(LucidePlay);

const Play = (props: React.ComponentProps<LucideIcon>) => (
  <LucidePlay className={cn("text-foreground", props.className)} {...props} />
);

export { Play };
