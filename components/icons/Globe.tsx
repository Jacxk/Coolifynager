import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { LucideGlobe } from "lucide-react-native";
import React from "react";

iconWithClassName(LucideGlobe);

const Globe = (props: React.ComponentProps<LucideIcon>) => (
  <LucideGlobe className={cn("text-foreground", props.className)} {...props} />
);
export { Globe };
