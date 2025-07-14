import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { BookOpenText as LucideBookOpenText } from "lucide-react-native";
import React from "react";
iconWithClassName(LucideBookOpenText);
const BookOpenText = (props: React.ComponentProps<LucideIcon>) => (
  <LucideBookOpenText
    className={cn("text-foreground", props.className)}
    {...props}
  />
);
export { BookOpenText };
