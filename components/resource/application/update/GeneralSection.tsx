import {
  BuildPack,
  RedirectType,
  UpdateApplicationBody,
} from "@/api/types/application.types";
import InfoDialog from "@/components/InfoDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { H3 } from "@/components/ui/typography";
import { isValidUrl } from "@/lib/utils";
import {
  Control,
  Controller,
  FieldErrors,
  useController,
} from "react-hook-form";
import { View } from "react-native";

const redirectLabel = (type?: string) =>
  type === RedirectType.both
    ? "Allow www & non-www."
    : type === RedirectType.www
    ? "Redirect to www."
    : "Redirect to non-www.";

const buildPackLabel = (type?: string) =>
  type === BuildPack.nixpacks
    ? "Nixpacks"
    : type === BuildPack.static
    ? "Static"
    : type === BuildPack.dockerfile
    ? "Dockerfile"
    : "Docker Compose";

export function BuildPackSelect({
  value,
  onChange,
}: {
  value: BuildPack;
  onChange: (value: BuildPack) => void;
}) {
  return (
    <Select
      value={{
        value: value,
        label: buildPackLabel(value),
      }}
      onValueChange={(option) => onChange(option?.value as BuildPack)}
    >
      <SelectTrigger>
        <SelectValue
          placeholder="Select a build pack"
          className="text-foreground"
        />
      </SelectTrigger>
      <SelectContent>
        {Object.values(BuildPack).map((value) => (
          <SelectItem key={value} value={value} label={buildPackLabel(value)} />
        ))}
      </SelectContent>
    </Select>
  );
}

export default function GeneralSection({
  control,
  errors,
  readonlyLabels,
}: {
  control: Control<UpdateApplicationBody>;
  errors: FieldErrors<UpdateApplicationBody>;
  readonlyLabels: boolean;
}) {
  const {
    field: { value: buildPack },
  } = useController({
    control,
    name: "build_pack",
  });

  return (
    <View className="gap-2">
      <H3>General</H3>
      <View className="flex-1 gap-1">
        <Text className="text-muted-foreground">Build Pack</Text>
        <Controller
          control={control}
          name="build_pack"
          render={({ field: { onChange, value } }) => (
            <BuildPackSelect
              value={value ?? BuildPack.nixpacks}
              onChange={onChange}
            />
          )}
        />
      </View>

      {buildPack === BuildPack.static && (
        <>
          <View className="flex-1 gap-1">
            <Text className="text-muted-foreground">Static Image</Text>
            <Controller
              control={control}
              name="static_image"
              render={({ field: { onChange, value } }) => (
                <Select
                  value={{
                    value: value ?? "",
                    label: value ?? "",
                  }}
                  onValueChange={(option) => onChange(option?.value)}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder="Select a build pack"
                      className="text-foreground"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nginx:alpine" label="nginx:alpine" />
                    <SelectItem
                      disabled
                      value="apache:latest"
                      label="apache:latest"
                    />
                  </SelectContent>
                </Select>
              )}
            />
          </View>

          <View className="flex-1 gap-1">
            <InfoDialog
              label="Custom Nginx Configuration"
              description="You can add custom Nginx configuration here."
            />
            <Controller
              control={control}
              name="custom_nginx_configuration"
              render={({ field: { onChange, value } }) => (
                <Textarea
                  value={value ?? ""}
                  onChangeText={onChange}
                  className="h-96 min-h-10"
                  autoCapitalize="none"
                />
              )}
            />
          </View>
        </>
      )}

      <View className="flex-1 gap-1">
        <InfoDialog
          label="Domains"
          description={
            !readonlyLabels
              ? "Readonly labels are disabled. You can set the domains in the labels section."
              : "You can specify one domain with path or more with comma or new lines. You can specify a port to bind the domain to."
          }
        >
          {readonlyLabels && (
            <View>
              <Text className="text-yellow-500 font-bold">Example</Text>
              <Text className="text-muted-foreground">
                - http://app.coolify.io,https://cloud.coolify.io/dashboard
              </Text>
              <Text className="text-muted-foreground">
                - http://app.coolify.io/api/v3
              </Text>
              <Text className="text-muted-foreground">
                - http://app.coolify.io:3000 {"->"} app.coolify.io will point to
                port 3000 inside the container.
              </Text>
            </View>
          )}
        </InfoDialog>

        <Controller
          control={control}
          name="domains"
          disabled={readonlyLabels}
          rules={{
            required: "Domains are required",
            validate: (domains) => {
              const invalidDomains = domains
                ?.split(/[\n,]+/)
                .filter((domain) => !isValidUrl(domain));

              if (invalidDomains && invalidDomains.length > 0) {
                return `Invalid domain: ${invalidDomains.join(", ")}`;
              }
              return undefined;
            },
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <Textarea
              placeholder="https://coolify.io"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              className="max-h-24 min-h-10"
              keyboardType="url"
              autoCapitalize="none"
              editable={readonlyLabels}
            />
          )}
        />
        {errors.domains && (
          <Text className="text-red-500">{errors.domains.message}</Text>
        )}
      </View>
      <View className="flex-1 gap-1">
        <InfoDialog
          label="Direction"
          description="You must need to add www and non-www as an A DNS record. Make sure the www domain is added under Domains."
        />

        <Controller
          control={control}
          name="redirect"
          render={({ field: { onChange, value } }) => (
            <Select
              value={{
                value: value ?? "",
                label: redirectLabel(value),
              }}
              onValueChange={(option) => onChange(option?.value)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder="Select a redirect type"
                  className="text-foreground"
                />
              </SelectTrigger>
              <SelectContent>
                {Object.values(RedirectType).map((value) => (
                  <SelectItem
                    key={value}
                    value={value}
                    label={redirectLabel(value)}
                  />
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </View>
    </View>
  );
}
