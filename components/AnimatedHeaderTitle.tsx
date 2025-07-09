import { Text } from "@/components/ui/text";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AnimatedHeaderTitleProps = {
  name: string;
  showTitle: boolean;
  status?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
};

export const AnimatedHeader = ({
  name,
  status,
  showTitle,
  leftComponent,
  rightComponent,
}: AnimatedHeaderTitleProps) => {
  const titleProgress = useSharedValue(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    titleProgress.value = withSpring(showTitle ? 1 : 0, {
      damping: 20,
      stiffness: 90,
    });
  }, [showTitle]);

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(titleProgress.value, [0, 1], [8, 0]),
        },
      ],
      opacity: titleProgress.value,
    };
  });

  return (
    <View
      className="flex flex-row justify-between px-4 h-26 border-b border-border"
      style={{ paddingTop: insets.top }}
    >
      <View className="">{leftComponent}</View>

      <Animated.View
        style={titleAnimatedStyle}
        className="flex items-center w-1/2"
      >
        <Text
          className="text-base font-semibold text-center "
          numberOfLines={1}
        >
          {name}
        </Text>

        <Text
          className="text-xs text-muted-foreground text-center"
          numberOfLines={1}
        >
          {status}
        </Text>
      </Animated.View>

      <View className="">{rightComponent}</View>
    </View>
  );
};
