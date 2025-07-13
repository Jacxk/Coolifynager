import { InitScript } from "@/api/types/database.types";
import InfoDialog from "@/components/InfoDialog";
import ReadOnlyText from "@/components/ReadOnlyText";
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
      <InfoDialog
        label={<H3>Initialization scripts</H3>}
        description={<ReadOnlyText />}
      />
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
