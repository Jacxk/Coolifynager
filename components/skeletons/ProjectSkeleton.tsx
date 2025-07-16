import { SectionList } from "react-native";
import { SafeView } from "../SafeView";
import { Skeleton } from "../ui/skeleton";
import { SkeletonCard } from "./SkeletonCard";

export function ProjectSkeleton() {
  return (
    <SafeView className="p-0">
      <SectionList
        className="flex-1 p-4"
        contentContainerClassName="gap-2"
        sections={[
          { data: Array.from({ length: 3 }) },
          { data: Array.from({ length: 3 }) },
          { data: Array.from({ length: 3 }) },
        ]}
        renderItem={() => <SkeletonCard />}
        keyExtractor={(_, index) => index.toString()}
        renderSectionHeader={() => <Skeleton className="h-10 w-1/2" />}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </SafeView>
  );
}
