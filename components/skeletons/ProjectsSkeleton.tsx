import { FlatList, View } from "react-native";
import { SafeView } from "../SafeView";
import { SkeletonCard } from "./SkeletonCard";

export function ProjectsSkeleton() {
  return (
    <SafeView className="p-0">
      <FlatList
        contentContainerClassName="p-4"
        data={Array.from({ length: 5 })}
        renderItem={() => <SkeletonCard />}
        keyExtractor={(_, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeView>
  );
}
