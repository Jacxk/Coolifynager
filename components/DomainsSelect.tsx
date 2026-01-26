import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { openBrowserAsync } from "expo-web-browser";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Globe } from "./icons/Globe";

type DomainsSelectProps = {
  domains: string[];
  label?: string;
};

export function DomainsSelect({
  domains,
  className,
}: DomainsSelectProps & { className?: string }) {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  if (!domains || domains.length === 0) {
    return null;
  }

  return (
    <Select className={className}>
      <SelectTrigger className="p-0 gap-2 border-0">
        <Globe />
      </SelectTrigger>
      <SelectContent insets={contentInsets}>
        <SelectGroup>
          {domains.map((domain) => {
            domain = domain.replace(/:\d+$/, "");
            return (
              <SelectItem
                onPress={() => openBrowserAsync(domain)}
                label={domain}
                value={domain}
                key={domain}
                hideIndicator
              >
                {domain}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
