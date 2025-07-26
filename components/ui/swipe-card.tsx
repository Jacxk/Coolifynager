import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import * as React from "react";
import { useImperativeHandle } from "react";
import { useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  type WithSpringConfig,
} from "react-native-reanimated";

export type SwipeableCardHaptics = "left" | "right" | "none" | "both";

export enum SwipeDirection {
  Left = "left",
  Right = "right",
}

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
  onThresholdMet?: (direction: SwipeDirection) => void;
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
  /**
   * If `true`, the card will animate off-screen and fade out on a successful left swipe.
   * The `onSwipeLeft` callback is fired before the animation starts.
   * @default true
   */
  dismissOnSwipeLeft?: boolean;
  /**
   * If `true`, the card will animate off-screen and fade out on a successful right swipe.
   * The `onSwipeRight` callback is fired before the animation starts.
   * @default false
   */
  dismissOnSwipeRight?: boolean;
  /**
   * Callback fired after the dismiss animation is complete.
   * This is where you should remove the item from your state.
   * @param direction The direction the card was dismissed to
   */
  onDismiss?: (direction: SwipeDirection) => void;
  /**
   * Width offset for left content positioning behind the container.
   * Helps with rounded corner appearance.
   * @default 20
   */
  leftWidthOffset?: number;
  /**
   * Width offset for right content positioning behind the container.
   * Helps with rounded corner appearance.
   * @default 20
   */
  rightWidthOffset?: number;
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
      dismissOnSwipeLeft = false,
      dismissOnSwipeRight = false,
      onDismiss,
      leftWidthOffset = 20,
      rightWidthOffset = 20,
    },
    ref
  ) => {
    const { width: screenWidth } = useWindowDimensions();

    // Animation values
    const translationX = useSharedValue(0);
    const startX = useSharedValue(0);
    const cardOpacity = useSharedValue(1);
    const sideContentWidth = useSharedValue(0);
    const sideContentOpacity = useSharedValue(0);

    // State tracking
    const isGestureActive = useSharedValue(false);
    const isThresholdMet = useSharedValue(false);
    const isDismissing = useSharedValue(false);
    const [isDismissed, setIsDismissed] = React.useState(false);

    // Helper functions for haptics
    const shouldTriggerHaptic = (direction: SwipeDirection) => {
      "worklet";
      return haptics === "both" || haptics === direction;
    };

    const triggerThresholdHaptic = (direction: SwipeDirection) => {
      if (shouldTriggerHaptic(direction)) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    };

    const triggerCancelHaptic = (direction: SwipeDirection) => {
      if (shouldTriggerHaptic(direction)) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    };

    const triggerSuccessHaptic = () => {
      if (hapticsOnSuccess) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    };

    const resetValues = (spring = true) => {
      "worklet";
      const config = spring ? withSpring : withTiming;
      translationX.value = config(0, animationConfig);
      sideContentWidth.value = config(0, animationConfig);
      sideContentOpacity.value = config(0, animationConfig);
      cardOpacity.value = config(1, animationConfig);
      isThresholdMet.value = false;
    };

    // Expose imperative handles
    useImperativeHandle(ref, () => ({
      close: () => {
        resetValues();
      },
      openLeft: () => {
        if (!leftContent) return;
        const openValue = threshold + leftWidthOffset;
        translationX.value = withSpring(openValue, animationConfig);
        sideContentWidth.value = withSpring(openValue, animationConfig);
        sideContentOpacity.value = 1;
        cardOpacity.value = 1;
      },
      openRight: () => {
        if (!rightContent) return;
        const openValue = -(threshold + rightWidthOffset);
        translationX.value = withSpring(openValue, animationConfig);
        sideContentWidth.value = withSpring(openValue, animationConfig);
        sideContentOpacity.value = 1;
        cardOpacity.value = 1;
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
      .enabled(enabled && !isDismissed)
      .shouldCancelWhenOutside(false)
      .onBegin(() => {
        if (isDismissing.value || isDismissed) return;
        startX.value = translationX.value;
        isGestureActive.value = false;
        if (onSwipeStart) {
          runOnJS(onSwipeStart)();
        }
      })
      .onUpdate((event) => {
        if (isDismissing.value || isDismissed) return;
        translationX.value = getConstrainedTranslation(
          startX.value + event.translationX
        );

        sideContentWidth.value = translationX.value;

        // Update opacity based on translation
        const absTranslation = Math.abs(translationX.value);
        if (absTranslation >= threshold) {
          sideContentOpacity.value = 1;
        } else {
          sideContentOpacity.value = interpolate(
            absTranslation,
            [0, threshold / 2],
            [0, 0.5],
            Extrapolation.CLAMP
          );
        }

        // Handle threshold detection
        const isSwipeRight = translationX.value > threshold;
        const isSwipeLeft = translationX.value < -threshold;

        if (isSwipeRight || isSwipeLeft) {
          if (!isThresholdMet.value) {
            isThresholdMet.value = true;
            const direction = isSwipeRight
              ? SwipeDirection.Right
              : SwipeDirection.Left;
            runOnJS(triggerThresholdHaptic)(direction);
            if (onThresholdMet) runOnJS(onThresholdMet)(direction);
          }
          isGestureActive.value = true;
        } else {
          // Check if we're going back below threshold after having met it
          if (isThresholdMet.value) {
            // Determine which direction was cancelled based on current translation
            const cancelDirection =
              translationX.value > 0
                ? SwipeDirection.Right
                : SwipeDirection.Left;
            runOnJS(triggerCancelHaptic)(cancelDirection);
          }
          isGestureActive.value = false;
          isThresholdMet.value = false;
        }
      })
      .onEnd(() => {
        if (isDismissing.value || isDismissed) return;

        const isSwipeRight = translationX.value > threshold;
        const isSwipeLeft = translationX.value < -threshold;

        const shouldDismiss =
          (isSwipeRight && dismissOnSwipeRight) ||
          (isSwipeLeft && dismissOnSwipeLeft);

        if (shouldDismiss) {
          isDismissing.value = true;
          runOnJS(triggerSuccessHaptic)();

          // Fire the primary callback immediately
          if (isSwipeRight && onSwipeRight) runOnJS(onSwipeRight)();
          if (isSwipeLeft && onSwipeLeft) runOnJS(onSwipeLeft)();

          const dismissDirection = isSwipeRight
            ? SwipeDirection.Right
            : SwipeDirection.Left;
          const toValue = isSwipeRight ? screenWidth * 1.2 : -screenWidth * 1.2;

          translationX.value = withTiming(toValue, { duration: 250 });
          sideContentWidth.value = withTiming(toValue, { duration: 250 });
          cardOpacity.value = withTiming(0, { duration: 200 });
          // Delay opacity fade until translation is nearly complete
          sideContentOpacity.value = withDelay(
            180,
            withTiming(0, { duration: 300 }, (finished) => {
              if (finished) {
                if (onDismiss) runOnJS(onDismiss)(dismissDirection);
                runOnJS(setIsDismissed)(true);
              }
            })
          );
        } else {
          if (isSwipeRight || isSwipeLeft) {
            // Only trigger success haptics if threshold was met
            if (isThresholdMet.value) {
              runOnJS(triggerSuccessHaptic)();
            }

            if (isSwipeRight && onSwipeRight) {
              runOnJS(onSwipeRight)();
            } else if (isSwipeLeft && onSwipeLeft) {
              runOnJS(onSwipeLeft)();
            }
          }

          if (closeOnSwipe) {
            resetValues();
          }
        }

        if (onSwipeEnd) {
          runOnJS(onSwipeEnd)();
        }
      });

    // Animated styles
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translationX.value }],
      opacity: cardOpacity.value,
    }));

    const leftStyle = useAnimatedStyle(() => ({
      width: Math.max(0, sideContentWidth.value + leftWidthOffset),
      opacity: sideContentOpacity.value,
    }));

    const rightStyle = useAnimatedStyle(() => ({
      width: Math.max(0, -sideContentWidth.value + rightWidthOffset),
      opacity: sideContentOpacity.value,
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
