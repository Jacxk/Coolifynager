import { iconWithClassName } from "@/lib/iconWithClassName";
import type { LucideIcon } from "lucide-react-native";
import { Layers as LucideLayers } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideLayers);
const Layers = (props: React.ComponentProps<LucideIcon>) => (
  <LucideLayers className={props.className ?? "text-foreground"} {...props} />
);
export { Layers };
