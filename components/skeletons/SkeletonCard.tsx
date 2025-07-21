import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export function SkeletonCard({ className }: { className?: string }) {
  return <Skeleton className={cn("h-24 w-full", className)} />;
}
