import { ResourceHttpError } from "@/api/types/resources.types";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

type LogObject = {
  output: string;
  hidden?: boolean;
};

type LogsViewerProps = {
  logs?: string | LogObject[];
  isLoading?: boolean;
  className?: string;
  error?: ResourceHttpError;
};

function LogLineItem({
  log,
  className,
}: {
  log: LogObject;
  className?: string;
}) {
  return (
    <View className={cn("flex-row items-stretch w-full", className)}>
      <Text
        className={cn("font-mono flex-1", {
          "text-yellow-600 bg-yellow-500/10": log.hidden,
        })}
        selectable
      >
        {log.output}
      </Text>
    </View>
  );
}

export default function LogsViewer({
  logs,
  isLoading,
  className,
  error,
}: LogsViewerProps) {
  const isLogString = typeof logs === "string";
  const [isAtBottom, setIsAtBottom] = useState(true);
  const scrollViewRef = useRef<FlatList>(null);
  const scrollTranslateY = useSharedValue(0);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIsAtBottom = e.nativeEvent.contentOffset.y < 200;
    setIsAtBottom(newIsAtBottom);
  }, []);

  const scrollAnimatedStyle = useAnimatedStyle(() => {
    return {
      bottom: interpolate(scrollTranslateY.value, [0, 1], [-100, 8]),
    };
  });

  useEffect(() => {
    scrollTranslateY.value = withTiming(isAtBottom ? 0 : 1);
  }, [isAtBottom]);

  const noLogs =
    !logs ||
    (Array.isArray(logs) && logs.length === 0) ||
    (isLogString && logs.trim() === "");

  const logData = isLogString
    ? (logs as string)
        .split("\n")
        .map((line) => ({ output: line, hidden: false }))
    : (logs as LogObject[]);

  return (
    <View className="flex-1 relative">
      <FlatList
        ref={scrollViewRef}
        inverted={error?.message === undefined || !noLogs}
        invertStickyHeaders
        onScroll={onScroll}
        scrollEventThrottle={16}
        className="flex-1 rounded-md border border-input"
        contentContainerClassName="p-4"
        keyboardDismissMode="interactive"
        data={logData}
        renderItem={({ item }) => (
          <LogLineItem log={item} className={className} />
        )}
        keyExtractor={(_, index) => `line-${index.toString()}`}
        ListEmptyComponent={() => {
          if (error)
            return (
              <View className="flex-1 pt-4 items-center">
                <Text className="border-0 text-muted-foreground font-mono">
                  {error?.message}
                </Text>
              </View>
            );

          if (isLoading)
            return (
              <View className="gap-2">
                {Array.from({ length: 30 }).map((_, index) => (
                  <Skeleton className="h-4 w-full" key={index} />
                ))}
              </View>
            );

          if (noLogs)
            return (
              <View className="flex-1 pt-4 items-center">
                <Text className="border-0 text-muted-foreground font-mono">
                  No logs found
                </Text>
              </View>
            );
          return null;
        }}
      />
      <Animated.View
        className="absolute flex-1 left-2"
        style={scrollAnimatedStyle}
      >
        <Button
          variant="secondary"
          onPress={() => {
            scrollViewRef.current?.scrollToOffset({
              offset: 0,
              animated: true,
            });
          }}
        >
          <Text>Scroll to bottom</Text>
        </Button>
      </Animated.View>
    </View>
  );
}
