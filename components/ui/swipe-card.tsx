import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import * as React from "react";
import { useImperativeHandle } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type WithSpringConfig,
} from "react-native-reanimated";

const OPEN_OFFSET = 20;

export type SwipeableCardHaptics = "left" | "right" | "none" | "both";

/**
 * Imperative API for the SwipeableCard component.
 */
export type SwipeableCardRef = {
  /** Closes the card to its resting position. */
  close: () => void;
  /** Swipes the card right to reveal the left content. */
  openLeft: () => void;
  /** Swipes the card left to reveal the right content. */
  openRight: () => void;
};

export type SwipeableCardProps = {
  /** The main content of the card. */
  children?: React.ReactNode;
  /** Tailwind classes for the left content container. */
  leftContentClassName?: string;
  /** Tailwind classes for the right content container. */
  rightContentClassName?: string;
  /** Tailwind classes for the main card container. */
  className?: string;
  /** Callback fired when the card is swiped left past the threshold. */
  onSwipeLeft?: () => void;
  /** Callback fired when the card is swiped right past the threshold. */
  onSwipeRight?: () => void;
  /** Content to display when swiping right (revealed from the left). */
  leftContent?: React.ReactNode;
  /** Content to display when swiping left (revealed from the right). */
  rightContent?: React.ReactNode;
  /**
   * Haptic feedback mode for swipe gestures.
   * - "left": Haptic on left swipe.
   * - "right": Haptic on right swipe.
   * - "both": Haptic on both swipes.
   * - "none": No haptic feedback.
   * @default "both"
   */
  haptics?: SwipeableCardHaptics;
  /**
   * Whether to trigger success haptics when a swipe action is completed.
   * @default true
   */
  hapticsOnSuccess?: boolean;
  /**
   * Distance in pixels required to trigger swipe actions.
   * @default 130
   */
  threshold?: number;
  /** Callback fired when the swipe threshold is first met. */
  onThresholdMet?: (direction: "left" | "right") => void;
  /**
   * Reanimated spring animation configuration for the return-to-center animation.
   * @default { damping: 20, stiffness: 100 }
   */
  animationConfig?: WithSpringConfig;
  /** Callback fired when the user starts a swipe gesture. */
  onSwipeStart?: () => void;
  /** Callback fired when the user ends a swipe gesture. */
  onSwipeEnd?: () => void;
  /**
   * If `false`, the swipe gesture will be disabled.
   * @default true
   */
  enabled?: boolean;
  /**
   * If `false`, the card will not automatically close after a successful swipe.
   * @default true
   */
  closeOnSwipe?: boolean;
};

/**
 * A swipeable card component for React Native.
 *
 * It allows users to swipe left or right to reveal actions, with haptic feedback
 * and extensive customization options. It is built with Reanimated and
 * React Native Gesture Handler.
 */
export const SwipeableCard = React.forwardRef<
  SwipeableCardRef,
  SwipeableCardProps
>(
  (
    {
      children,
      onSwipeLeft,
      onSwipeRight,
      leftContent,
      rightContent,
      leftContentClassName,
      rightContentClassName,
      className,
      haptics = "both",
      hapticsOnSuccess = true,
      threshold = 130,
      onThresholdMet,
      animationConfig = { damping: 20, stiffness: 100 },
      onSwipeStart,
      onSwipeEnd,
      enabled = true,
      closeOnSwipe = true,
    },
    ref
  ) => {
    // Animation values
    const translationX = useSharedValue(0);
    const width = useSharedValue(0);
    const opacity = useSharedValue(0);
    const opacityActive = useSharedValue(0);

    // State tracking
    const isGestureActive = useSharedValue(false);
    const isThresholdMet = useSharedValue(false);

    // Helper functions for haptics
    const shouldTriggerHaptic = (direction: "left" | "right") => {
      "worklet";
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
      if (hapticsOnSuccess) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    };

    const resetValues = () => {
      "worklet";
      opacityActive.value = withSpring(0, animationConfig);
      translationX.value = withSpring(0, animationConfig);
      width.value = withSpring(0, animationConfig);
      opacity.value = withSpring(0, animationConfig);
      isThresholdMet.value = false;
    };

    // Expose imperative handles
    useImperativeHandle(ref, () => ({
      close: () => {
        resetValues();
      },
      openLeft: () => {
        if (!leftContent) return;
        const openValue = threshold + OPEN_OFFSET;
        translationX.value = withSpring(openValue, animationConfig);
        width.value = withSpring(openValue, animationConfig);
        opacityActive.value = 1;
      },
      openRight: () => {
        if (!rightContent) return;
        const openValue = -(threshold + OPEN_OFFSET);
        translationX.value = withSpring(openValue, animationConfig);
        width.value = withSpring(openValue, animationConfig);
        opacityActive.value = 1;
      },
    }));

    // Gesture constraints
    const getConstrainedTranslation = (currentTranslation: number) => {
      "worklet";
      if (!leftContent && !rightContent) return 0;
      if (leftContent && !rightContent) return Math.max(0, currentTranslation);
      if (!leftContent && rightContent) return Math.min(0, currentTranslation);
      return currentTranslation;
    };

    const panGesture = Gesture.Pan()
      .enabled(enabled)
      .shouldCancelWhenOutside(false)
      .onBegin(() => {
        isGestureActive.value = false;
        if (onSwipeStart) {
          runOnJS(onSwipeStart)();
        }
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
        const isSwipeRight = translationX.value > threshold;
        const isSwipeLeft = translationX.value < -threshold;

        if (isSwipeRight) {
          if (!isThresholdMet.value) {
            isThresholdMet.value = true;
            runOnJS(triggerThresholdHaptic)("right");
            if (onThresholdMet) runOnJS(onThresholdMet)("right");
          }
          opacityActive.value = 1;
          isGestureActive.value = true;
        } else if (isSwipeLeft) {
          if (!isThresholdMet.value) {
            isThresholdMet.value = true;
            runOnJS(triggerThresholdHaptic)("left");
            if (onThresholdMet) runOnJS(onThresholdMet)("left");
          }
          opacityActive.value = 1;
          isGestureActive.value = true;
        } else {
          // Check if we're going back below threshold after having met it
          if (isThresholdMet.value) {
            // Determine which direction was cancelled based on current translation
            const cancelDirection = translationX.value > 0 ? "right" : "left";
            runOnJS(triggerCancelHaptic)(cancelDirection);
          }
          opacityActive.value = 0;
          isGestureActive.value = false;
          isThresholdMet.value = false;
        }

        // Update width for side content
        width.value = event.translationX;
      })
      .onEnd(() => {
        const isSwipeRight = translationX.value > threshold;
        const isSwipeLeft = translationX.value < -threshold;

        if (isSwipeRight) {
          runOnJS(triggerSuccessHaptic)();
          if (onSwipeRight) runOnJS(onSwipeRight)();
        } else if (isSwipeLeft) {
          runOnJS(triggerSuccessHaptic)();
          if (onSwipeLeft) runOnJS(onSwipeLeft)();
        }

        if (closeOnSwipe) {
          resetValues();
        }

        if (onSwipeEnd) {
          runOnJS(onSwipeEnd)();
        }
      });

    // Animated styles
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translationX.value }],
    }));

    const leftStyle = useAnimatedStyle(() => ({
      width: Math.max(0, width.value),
      opacity: Math.max(opacity.value, opacityActive.value),
    }));

    const rightStyle = useAnimatedStyle(() => ({
      width: Math.max(0, -width.value),
      opacity: Math.max(opacity.value, opacityActive.value),
    }));

    return (
      <GestureDetector gesture={panGesture}>
        <View className="relative">
          {/* Left content (revealed when swiping right) */}
          <Animated.View
            className={cn(
              "absolute h-full w-0 overflow-hidden items-center justify-center left-0",
              leftContentClassName
            )}
            style={[leftStyle]}
          >
            {leftContent}
          </Animated.View>

          {/* Right content (revealed when swiping left) */}
          <Animated.View
            className={cn(
              "absolute h-full w-0 overflow-hidden items-center justify-center right-0",
              rightContentClassName
            )}
            style={[rightStyle]}
          >
            {rightContent}
          </Animated.View>

          {/* Main card content */}
          <Animated.View className={className} style={[animatedStyle]}>
            {children}
          </Animated.View>
        </View>
      </GestureDetector>
    );
  }
);

SwipeableCard.displayName = "SwipeableCard";
