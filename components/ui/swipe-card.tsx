import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export type SwipeCardHaptics = "left" | "right" | "none" | "both";

type SwipeGestureProps = {
  children?: React.ReactNode;
  leftContentClassName?: string;
  rightContentClassName?: string;
  className?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  haptics?: SwipeCardHaptics;
  acceptHaptics?: boolean;
  threshold?: number;
  onThresholdMet?: (direction: "left" | "right") => void;
};

/**
 * SwipeGesture is a swipeable card component for React Native using Expo and NativeWind.
 * It allows users to swipe left or right to trigger actions, with optional haptic feedback and custom content.
 *
 * @param children - The main content of the card.
 * @param onSwipeLeft - Callback fired when the card is swiped right past the threshold.
 * @param onSwipeRight - Callback fired when the card is swiped left past the threshold.
 * @param leftContent - Content to display when swiping right (revealed from the left).
 * @param rightContent - Content to display when swiping left (revealed from the right).
 * @param leftContentClassName - Tailwind classes for the left content container.
 * @param rightContentClassName - Tailwind classes for the right content container.
 * @param className - Tailwind classes for the main card container.
 * @param haptics - Haptic feedback mode: "left", "right", "both", or "none" (default: "both").
 * @param acceptHaptics - Whether to trigger success haptics when action is completed (default: true).
 * @param threshold - Distance in pixels required to trigger swipe actions (default: 130).
 * @param onThresholdMet - Callback fired when threshold is first met with direction.
 */
export function SwipeGesture({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftContent,
  rightContent,
  leftContentClassName,
  rightContentClassName,
  className,
  haptics = "both",
  acceptHaptics = true,
  threshold = 130,
  onThresholdMet,
}: SwipeGestureProps) {
  // Animation values
  const translationX = useSharedValue(0);
  const width = useSharedValue(0);
  const opacity = useSharedValue(0);
  const opacityActive = useSharedValue(0);

  // State tracking
  const gestureAccepted = useSharedValue(false);
  const thresholdMet = useSharedValue(false);

  // Helper functions for haptics
  const shouldTriggerHaptic = (direction: "left" | "right") => {
    return haptics === "both" || haptics === direction;
  };

  const triggerThresholdHaptic = (direction: "left" | "right") => {
    if (shouldTriggerHaptic(direction)) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const triggerCancelHaptic = (direction: "left" | "right") => {
    if (shouldTriggerHaptic(direction)) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const triggerSuccessHaptic = () => {
    if (acceptHaptics) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  // Gesture constraints
  const getConstrainedTranslation = (translation: number) => {
    if (!leftContent && !rightContent) return 0;
    if (leftContent && !rightContent) return Math.max(0, translation);
    if (!leftContent && rightContent) return Math.min(0, translation);
    return translation;
  };

  const panGesture = Gesture.Pan()
    .shouldCancelWhenOutside(false)
    .runOnJS(true)
    .onBegin(() => {
      gestureAccepted.value = false;
    })
    .onUpdate((event) => {
      translationX.value = getConstrainedTranslation(event.translationX);

      // Update opacity based on translation
      opacity.value = interpolate(
        Math.abs(event.translationX),
        [0, 100],
        [0, 0.2],
        Extrapolation.CLAMP
      );

      // Handle threshold detection
      const isRightSwipe = translationX.value > threshold;
      const isLeftSwipe = translationX.value < -threshold;

      if (isRightSwipe) {
        if (!thresholdMet.value) {
          thresholdMet.value = true;
          triggerThresholdHaptic("left");
          onThresholdMet?.("right");
        }
        opacityActive.value = 1;
        gestureAccepted.value = true;
      } else if (isLeftSwipe) {
        if (!thresholdMet.value) {
          thresholdMet.value = true;
          triggerThresholdHaptic("right");
          onThresholdMet?.("left");
        }
        opacityActive.value = 1;
        gestureAccepted.value = true;
      } else {
        // Check if we're going back below threshold after having met it
        if (thresholdMet.value) {
          // Determine which direction was cancelled based on current translation
          const cancelDirection = translationX.value > 0 ? "left" : "right";
          triggerCancelHaptic(cancelDirection);
        }
        opacityActive.value = 0;
        gestureAccepted.value = false;
        thresholdMet.value = false;
      }

      // Update width for side content
      if (translationX.value > 0) {
        width.value = event.translationX + 10;
      } else if (translationX.value < 0) {
        width.value = event.translationX - 10;
      } else {
        width.value = 0;
      }
    })
    .onEnd(() => {
      const isRightSwipe = translationX.value > threshold;
      const isLeftSwipe = translationX.value < -threshold;

      if (isRightSwipe) {
        triggerSuccessHaptic();
        onSwipeLeft?.();
      } else if (isLeftSwipe) {
        triggerSuccessHaptic();
        onSwipeRight?.();
      }

      // Reset all values
      const springConfig = { damping: 20, stiffness: 100 };

      opacityActive.value = withSpring(0, springConfig);
      translationX.value = withSpring(0, springConfig);
      width.value = withSpring(0, springConfig);
      opacity.value = withSpring(0, springConfig);

      thresholdMet.value = false;
    });

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translationX.value }],
  }));

  const leftStyle = useAnimatedStyle(() => ({
    left: 0,
    width: Math.max(0, width.value),
    alignItems: "flex-start",
    opacity: Math.max(opacity.value, opacityActive.value),
  }));

  const rightStyle = useAnimatedStyle(() => ({
    right: 0,
    width: Math.max(0, -width.value),
    alignItems: "flex-end",
    opacity: Math.max(opacity.value, opacityActive.value),
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <View className="relative">
        {/* Left content (revealed when swiping right) */}
        <Animated.View
          className={cn(
            "absolute left-0 h-full w-0 overflow-hidden",
            leftContentClassName
          )}
          style={[leftStyle]}
        >
          <View className="px-4 justify-center h-full self-center">
            {leftContent}
          </View>
        </Animated.View>

        {/* Right content (revealed when swiping left) */}
        <Animated.View
          className={cn(
            "absolute right-0 h-full w-0 overflow-hidden",
            rightContentClassName
          )}
          style={[rightStyle]}
        >
          <View className="px-4 justify-center h-full self-center">
            {rightContent}
          </View>
        </Animated.View>

        {/* Main card content */}
        <Animated.View className={className} style={[animatedStyle]}>
          {children}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
