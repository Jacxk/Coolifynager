import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { Plus as LucidePlus } from "lucide-react-native";
import React from "react";

iconWithClassName(LucidePlus);

const Plus = (props: React.ComponentProps<LucideIcon>) => (
  <LucidePlus className={cn("text-foreground", props.className)} {...props} />
);

export { Plus };
