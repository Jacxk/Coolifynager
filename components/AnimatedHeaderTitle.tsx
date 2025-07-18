import { Text } from "@/components/ui/text";
import { useTheme } from "@react-navigation/native";
import { useEffect } from "react";
import { Platform, Pressable, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AnimatedHeaderTitleProps = {
  name: string;
  showTitle: boolean;
  status?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  onHeaderClick?: () => void;
};

export const AnimatedHeader = ({
  name,
  status,
  showTitle,
  leftComponent,
  rightComponent,
  onHeaderClick,
}: AnimatedHeaderTitleProps) => {
  const titleProgress = useSharedValue(0);
  const borderProgress = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  useEffect(() => {
    titleProgress.value = withSpring(showTitle ? 1 : 0, {
      damping: 20,
      stiffness: 90,
    });

    borderProgress.value = withTiming(showTitle ? 1 : 0);
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

  const containerShadowStyle = useAnimatedStyle(() => {
    const shadowOpacity = interpolate(borderProgress.value, [0, 1], [0, 0.15]);
    const baseStyle = {
      backgroundColor: colors.background,
    };

    if (Platform.OS === "ios") {
      return {
        ...baseStyle,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity,
        shadowRadius: 6,
      };
    } else {
      return {
        ...baseStyle,
        elevation: interpolate(borderProgress.value, [0, 1], [0, 6]),
      };
    }
  });

  return (
    <Animated.View
      className="flex flex-row justify-between items-center p-4 h-26 relative"
      style={[{ paddingTop: insets.top }, containerShadowStyle]}
    >
      <View className="z-10">{leftComponent}</View>

      <Animated.View
        style={titleAnimatedStyle}
        className="flex items-center absolute left-0 bottom-4 right-0"
      >
        <Pressable onPress={onHeaderClick} hitSlop={10}>
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
        </Pressable>
      </Animated.View>

      <View className="z-10">{rightComponent}</View>
    </Animated.View>
  );
};
