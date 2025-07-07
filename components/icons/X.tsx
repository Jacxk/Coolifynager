import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { X as LucideX } from "lucide-react-native";
import React from "react";

iconWithClassName(LucideX);

const X = (props: React.ComponentProps<LucideIcon>) => (
  <LucideX className={cn("text-foreground", props.className)} {...props} />
);

export { X };
