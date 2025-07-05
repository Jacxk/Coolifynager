import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { Eye as LucideEye } from "lucide-react-native";
import React from "react";

iconWithClassName(LucideEye);

const Eye = (props: React.ComponentProps<LucideIcon>) => (
  <LucideEye className={cn("text-foreground", props.className)} {...props} />
);

export { Eye };
