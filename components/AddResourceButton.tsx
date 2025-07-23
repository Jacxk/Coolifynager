import { LinkProps, router } from "expo-router";
import { Plus } from "./icons/Plus";
import { Button } from "./ui/button";

export function AddResourceButton({ href }: { href: LinkProps["href"] }) {
  return (
    <Button variant="ghost" size="icon" onPress={() => router.push(href)}>
      <Plus />
    </Button>
  );
}
