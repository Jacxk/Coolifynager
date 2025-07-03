import { getApplicationEnvs } from "@/api/application";
import { ApplicationEnv } from "@/api/types/application.types";
import LoadingScreen from "@/components/LoadingScreen";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { H2 } from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { View } from "react-native";
import { Card, CardContent } from "./ui/card";

export default function EnvironmentVariableList({ uuid }: { uuid: string }) {
  const { data: envs, isPending } = useQuery(getApplicationEnvs(uuid));

  if (isPending) return <LoadingScreen />;

  const previewEnvs = envs?.filter((env) => env.is_preview) || [];
  const productionEnvs = envs?.filter((env) => !env.is_preview) || [];

  const renderEnv = (env: ApplicationEnv) => (
    <Card key={env.uuid}>
      <CardContent className="p-6 gap-2">
        <Input
          placeholder="Key"
          className="font-semibold"
          value={env.key}
          editable={false}
        />
        <Input
          placeholder="Value"
          className="text-xs text-muted-foreground"
          value={env.value}
          textContentType="password"
          editable={false}
        />
        <View className="flex flex-row gap-4 flex-wrap">
          <View className="flex flex-row gap-2">
            <Text className="text-muted-foreground">Is Build Variable?</Text>
            <Checkbox
              checked={env.is_build_time}
              onCheckedChange={() => {}}
              disabled
            />
          </View>
          <View className="flex flex-row gap-2">
            <Text className="text-muted-foreground">Is Multiline?</Text>
            <Checkbox
              checked={env.is_multiline}
              onCheckedChange={() => {}}
              disabled
            />
          </View>
          <View className="flex flex-row gap-2">
            <Text className="text-muted-foreground">Is Literal?</Text>
            <Checkbox
              checked={env.is_literal}
              onCheckedChange={() => {}}
              disabled
            />
          </View>
        </View>
      </CardContent>
    </Card>
  );

  return (
    <View className="py-4">
      <View className="my-4">
        <H2 className="font-semibold border-0 pb-1">
          Production Deployments Environment Variables
        </H2>
        <Text className="text-muted-foreground">
          Environment (secrets) variables for Production.
        </Text>
      </View>
      {productionEnvs.length === 0 ? (
        <Text className="mb-4">No production environment variables found.</Text>
      ) : (
        <View className="gap-2">{productionEnvs.map(renderEnv)}</View>
      )}
      <View className="my-4">
        <H2 className="font-semibold border-0 pb-1">
          Preview Deployments Environment Variables
        </H2>
        <Text className="text-muted-foreground">
          Environment (secrets) variables for Preview Deployments.
        </Text>
      </View>
      {previewEnvs.length === 0 ? (
        <Text>No preview environment variables found.</Text>
      ) : (
        <View className="gap-2">{previewEnvs.map(renderEnv)}</View>
      )}
    </View>
  );
}
