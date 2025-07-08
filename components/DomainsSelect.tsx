import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { openBrowserAsync } from "expo-web-browser";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type DomainsSelectProps = {
  domains: string[];
  label?: string;
};

export function DomainsSelect({
  domains,
  label = "Links",
}: DomainsSelectProps) {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  // Don't render if no domains
  if (!domains || domains.length === 0) {
    return null;
  }

  return (
    <Select>
      <SelectTrigger>
        <Text>{label}</Text>
      </SelectTrigger>
      <SelectContent insets={contentInsets}>
        <SelectGroup>
          {domains.map((domain) => (
            <SelectItem
              onPress={() => openBrowserAsync(domain)}
              label={domain}
              value={domain}
              key={domain}
              hideIndicator
            >
              {domain}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
