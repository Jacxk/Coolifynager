import { createApplicationEnv } from "@/api/application";
import { SafeView } from "@/components/SafeView";
import { Button } from "@/components/ui/button";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { Input, PasswordInput } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router, useGlobalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { toast } from "sonner-native";

export default function ApplicationEnvironmentsCreate() {
  const queryClient = useQueryClient();
  const { uuid } = useGlobalSearchParams();
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [isBuildTime, setIsBuildTime] = useState(false);
  const [isLiteral, setIsLiteral] = useState(true);
  const [isPreview, setIsPreview] = useState(true);
  const valueInputRef = useRef<any>(null);

  const mutation = useMutation(
    createApplicationEnv(uuid as string, {
      onSuccess: () => {
        toast.success("Environment variable created successfully");
        queryClient.invalidateQueries({
          queryKey: ["applications", "envs", uuid],
        });
        router.back();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create environment variable");
      },
    })
  );

  const handleSubmit = () => {
    mutation.mutate({
      key,
      value,
      is_build_time: isBuildTime,
      is_literal: isLiteral,
      is_preview: isPreview,
    });
  };

  return (
    <ScrollView
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="always"
    >
      <SafeView bottomInset={false} className="gap-4">
        <View>
          <Text>Name</Text>
          <Input
            placeholder="Enter variable key"
            value={key}
            onChangeText={setKey}
            returnKeyType="next"
            onSubmitEditing={() => valueInputRef.current?.focus()}
          />
        </View>
        <View>
          <Text>Value</Text>
          <PasswordInput
            ref={valueInputRef}
            placeholder="Enter variable value"
            value={value}
            onChangeText={setValue}
          />
        </View>
        <Checkbox checked={isBuildTime} onCheckedChange={setIsBuildTime}>
          <CheckboxLabel>Is Build Variable?</CheckboxLabel>
          <CheckboxIcon />
        </Checkbox>
        <Checkbox checked={isLiteral} onCheckedChange={setIsLiteral}>
          <CheckboxLabel>Is Literal?</CheckboxLabel>
          <CheckboxIcon />
        </Checkbox>
        <Checkbox checked={isPreview} onCheckedChange={setIsPreview}>
          <CheckboxLabel>Is Preview?</CheckboxLabel>
          <CheckboxIcon />
        </Checkbox>
        {mutation.isError && (
          <Text className="text-red-500">
            {(mutation.error as Error)?.message ||
              "Failed to create environment variable"}
          </Text>
        )}
        <Button
          onPress={handleSubmit}
          disabled={!key || !value}
          loading={mutation.isPending}
        >
          <Text>Save</Text>
        </Button>
      </SafeView>
    </ScrollView>
  );
}
