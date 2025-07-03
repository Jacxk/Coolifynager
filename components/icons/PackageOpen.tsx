import { iconWithClassName } from "@/lib/iconWithClassName";
import type { LucideIcon } from "lucide-react-native";
import { PackageOpen as LucidePackageOpen } from "lucide-react-native";
import React from "react";
iconWithClassName(LucidePackageOpen);
const PackageOpen = (props: React.ComponentProps<LucideIcon>) => (
  <LucidePackageOpen
    className={props.className ?? "text-foreground"}
    {...props}
  />
);
export { PackageOpen };
