import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { Info as LucideInfo } from "lucide-react-native";
import React from "react";

iconWithClassName(LucideInfo);

const Info = (props: React.ComponentProps<LucideIcon>) => (
  <LucideInfo className={cn("text-foreground", props.className)} {...props} />
);

export default Info;
