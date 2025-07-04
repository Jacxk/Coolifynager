import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { Star as LucideStar } from "lucide-react-native";
import React from "react";

iconWithClassName(LucideStar);

const Star = (props: React.ComponentProps<LucideIcon>) => (
  <LucideStar className={cn("text-foreground", props.className)} {...props} />
);

export { Star };
