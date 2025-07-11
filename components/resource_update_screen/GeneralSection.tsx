import {
  BuildPack,
  RedirectType,
  UpdateApplicationBody,
} from "@/api/types/application.types";
import { View } from "react-native";
import InfoDialog from "../InfoDialog";
import { useConfiguration } from "../providers/ConfigurationProvider";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Text } from "../ui/text";
import { H3 } from "../ui/typography";

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

export default function GeneralSection() {
  const { configuration, updateConfiguration } =
    useConfiguration<UpdateApplicationBody>();

  const setBuildPack = (value: BuildPack) => {
    updateConfiguration({
      build_pack: value,
    });
  };

  const setRedirect = (value: RedirectType) => {
    updateConfiguration({
      redirect: value,
    });
  };

  const setDomains = (value: string) => {
    updateConfiguration({
      domains: value,
    });
  };

  return (
    <View className="gap-2">
      <H3>General</H3>
      <View className="flex-1 gap-1">
        <Text className="text-muted-foreground">Build Pack</Text>
        <Select
          value={{
            value: configuration.build_pack as BuildPack,
            label: buildPackLabel(configuration.build_pack as BuildPack),
          }}
          onValueChange={(value) => setBuildPack(value?.value as BuildPack)}
        >
          <SelectTrigger>
            <SelectValue
              placeholder="Select a build pack"
              className="text-foreground"
            />
          </SelectTrigger>
          <SelectContent>
            {Object.values(BuildPack).map((value) => (
              <SelectItem
                key={value}
                value={value}
                label={buildPackLabel(value)}
              />
            ))}
          </SelectContent>
        </Select>
      </View>
      <View className="gap-1">
        <View className="flex-row items-center">
          <Text className="text-muted-foreground">Domains</Text>
          <InfoDialog
            description="You can specify one domain with path or more with comma. You can specify a port to bind the domain to."
            title="Domains"
          >
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
          </InfoDialog>
        </View>
        <Input value={configuration.domains ?? ""} onChangeText={setDomains} />
      </View>
      <View className="gap-1">
        <View className="flex-row items-center">
          <Text className="text-muted-foreground">Direction</Text>
          <InfoDialog
            description="You must need to add www and non-www as an A DNS record. Make sure the www domain is added under Domains."
            title="Direction"
          />
        </View>
        <Select
          value={{
            value: configuration.redirect as RedirectType,
            label: redirectLabel(configuration.redirect as RedirectType),
          }}
          onValueChange={(value) => setRedirect(value?.value as RedirectType)}
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
      </View>
    </View>
  );
}
