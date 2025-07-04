import { iconWithClassName } from "@/lib/iconWithClassName";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { PackageOpen as LucidePackageOpen } from "lucide-react-native";
import React from "react";
iconWithClassName(LucidePackageOpen);
const PackageOpen = (props: React.ComponentProps<LucideIcon>) => (
  <LucidePackageOpen
    className={cn("text-foreground", props.className)}
    {...props}
  />
);
export { PackageOpen };
