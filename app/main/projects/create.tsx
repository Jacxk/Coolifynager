import { createProject } from "@/api/projects";
import { PartialProject } from "@/api/types/project.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useHeaderHeight } from "@react-navigation/elements";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, View } from "react-native";
import { toast } from "sonner-native";

export default function CreateProject() {
  const headerHeight = useHeaderHeight();
  const { control, handleSubmit } = useForm<PartialProject>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutateAsync } = useMutation(createProject());

  const onSubmit = (data: PartialProject) => {
    toast.promise(mutateAsync(data), {
      loading: "Creating project...",
      success: ({ uuid }) => {
        router.dismissTo({
          pathname: "/main/projects/[uuid]",
          params: { uuid, name: data.name },
        });
        return "Project created successfully";
      },
      error: (error) => (error as Error).message ?? "Failed to create project",
    });
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 gap-4 justify-center p-4"
      style={{ marginTop: -headerHeight }}
    >
      <Controller
        control={control}
        name="name"
        rules={{ required: true }}
        render={({
          field: { onChange, onBlur, value },
          formState: { errors },
        }) => (
          <View className="">
            <Text nativeID="name">Name</Text>
            <Input
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholder="Your Cool Project"
              nativeID="name"
            />
            {errors.name && (
              <Text className="text-red-500 text-sm">Name is required</Text>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="">
            <Text nativeID="description">Description</Text>
            <Input
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholder="This is my cool project everyone knows about"
              nativeID="description"
            />
          </View>
        )}
      />

      <Text className="text-muted-foreground text-sm">
        New project will have a default{" "}
        <Text className="font-bold text-yellow-500 text-sm">production</Text>{" "}
        environment.
      </Text>

      <Button onPress={handleSubmit(onSubmit)}>
        <Text>Continue</Text>
      </Button>
    </KeyboardAvoidingView>
  );
}
