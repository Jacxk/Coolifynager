import { InitScript } from "@/api/types/database.types";
import { Plus } from "@/components/icons/Plus";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { H3 } from "@/components/ui/typography";
import { View } from "react-native";

export default function InitializationScriptsSection({
  init_scripts,
}: {
  init_scripts: InitScript[] | null;
}) {
  return (
    <View className="gap-2">
      <View className="flex-row justify-between items-center">
        <H3>Initialization scripts</H3>
        <Button size="icon" variant="ghost">
          <Plus />
        </Button>
      </View>
      <View className="flex-1 gap-2">
        {init_scripts?.map((script) => (
          <Card key={script.index}>
            <CardHeader>
              <CardTitle>{script.filename}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </View>
    </View>
  );
}
