import { ChevronDown } from "@/components/icons/ChevronDown";
import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@rn-primitives/accordion";
import * as React from "react";
import { createContext } from "react";
import { Platform, Pressable, View } from "react-native";
import Animated, {
  Extrapolation,
  FadeIn,
  FadeOutUp,
  LayoutAnimationConfig,
  LinearTransition,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

// Context to provide expanded override
const AccordionExpandedContext = createContext<{ expanded?: boolean }>({});

/**
 * Accordion usage:
 *
 * // Single mode (default):
 * <Accordion defaultValue="item-1">
 *   <AccordionItem value="item-1">...</AccordionItem>
 *   <AccordionItem value="item-2">...</AccordionItem>
 * </Accordion>
 *
 * // Multiple mode:
 * <Accordion type="multiple" defaultValue={["item-1", "item-2"]}>
 *   <AccordionItem value="item-1">...</AccordionItem>
 *   <AccordionItem value="item-2">...</AccordionItem>
 * </Accordion>
 *
 * // Controlled:
 * const [open, setOpen] = React.useState("item-1"); // or [] for multiple
 * <Accordion value={open} onValueChange={setOpen}>
 *   <AccordionItem value="item-1">...</AccordionItem>
 *   <AccordionItem value="item-2">...</AccordionItem>
 * </Accordion>
 */
function Accordion({
  children,
  value,
  defaultValue,
  onValueChange,
  type,
  ...props
}: Omit<
  AccordionPrimitive.RootProps,
  "asChild" | "value" | "defaultValue" | "onValueChange"
> & {
  ref?: React.RefObject<AccordionPrimitive.RootRef>;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  type?: "single" | "multiple";
}) {
  // Only pass value/defaultValue as string[] if type==='multiple', else as string
  const rootProps: any = {
    ...props,
    type,
    asChild: Platform.OS !== "web",
  };
  if (type === "multiple") {
    if (value !== undefined) rootProps.value = value as string[];
    if (defaultValue !== undefined)
      rootProps.defaultValue = defaultValue as string[];
    if (onValueChange)
      rootProps.onValueChange = onValueChange as (value: string[]) => void;
  } else {
    if (value !== undefined) rootProps.value = value as string;
    if (defaultValue !== undefined)
      rootProps.defaultValue = defaultValue as string;
    if (onValueChange)
      rootProps.onValueChange = onValueChange as (value: string) => void;
  }
  return (
    <LayoutAnimationConfig skipEntering>
      <AccordionPrimitive.Root {...rootProps}>
        <Animated.View layout={LinearTransition.duration(200)}>
          {children}
        </Animated.View>
      </AccordionPrimitive.Root>
    </LayoutAnimationConfig>
  );
}

function AccordionItem({
  className,
  value,
  ...props
}: AccordionPrimitive.ItemProps & {
  ref?: React.RefObject<AccordionPrimitive.ItemRef>;
}) {
  return (
    <Animated.View
      className={"overflow-hidden"}
      layout={LinearTransition.duration(200)}
    >
      <AccordionPrimitive.Item
        className={cn("border-b border-border", className)}
        value={value}
        {...props}
      />
    </Animated.View>
  );
}

const Trigger = Platform.OS === "web" ? View : Pressable;

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.TriggerProps & {
  children?: React.ReactNode;
  ref?: React.RefObject<AccordionPrimitive.TriggerRef>;
}) {
  const { isExpanded } = AccordionPrimitive.useItemContext();

  const progress = useDerivedValue(() =>
    isExpanded
      ? withTiming(1, { duration: 250 })
      : withTiming(0, { duration: 200 })
  );
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
    opacity: interpolate(progress.value, [0, 1], [1, 0.8], Extrapolation.CLAMP),
  }));

  return (
    <TextClassContext.Provider value="native:text-lg font-medium web:group-hover:underline">
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger {...props} asChild>
          <Trigger
            className={cn(
              "flex flex-row web:flex-1 items-center justify-between py-4 web:transition-all group web:focus-visible:outline-none web:focus-visible:ring-1 web:focus-visible:ring-muted-foreground",
              className
            )}
          >
            {children}
            <Animated.View style={chevronStyle}>
              <ChevronDown size={18} className={"text-foreground shrink-0"} />
            </Animated.View>
          </Trigger>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    </TextClassContext.Provider>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.ContentProps & {
  ref?: React.RefObject<AccordionPrimitive.ContentRef>;
}) {
  const { isExpanded } = AccordionPrimitive.useItemContext();
  return (
    <TextClassContext.Provider value="native:text-lg">
      <AccordionPrimitive.Content
        className={cn(
          "overflow-hidden text-sm web:transition-all",
          isExpanded ? "web:animate-accordion-down" : "web:animate-accordion-up"
        )}
        {...props}
      >
        <InnerContent className={cn("pb-4", className)}>
          {children}
        </InnerContent>
      </AccordionPrimitive.Content>
    </TextClassContext.Provider>
  );
}

function InnerContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  if (Platform.OS === "web") {
    return <View className={cn("pb-4", className)}>{children}</View>;
  }
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOutUp.duration(200)}
      className={cn("pb-4", className)}
    >
      {children}
    </Animated.View>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
