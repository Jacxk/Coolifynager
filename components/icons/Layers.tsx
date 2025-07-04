import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { Layers as LucideLayers } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideLayers);
const Layers = (props: React.ComponentProps<LucideIcon>) => (
  <LucideLayers className={cn("text-foreground", props.className)} {...props} />
);
export { Layers };
