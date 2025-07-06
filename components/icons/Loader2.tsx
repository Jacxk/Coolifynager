import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { Loader2 as LucideLoader2 } from "lucide-react-native";
import React from "react";

iconWithClassName(LucideLoader2);

const Loader2 = (props: React.ComponentProps<LucideIcon>) => (
  <LucideLoader2
    className={cn("text-foreground", props.className)}
    {...props}
  />
);

export { Loader2 };
