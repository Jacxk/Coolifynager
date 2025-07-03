import { Layers } from "@/components/icons/Layers";
import { PackageOpen } from "@/components/icons/PackageOpen";
import { Server } from "@/components/icons/Server";
import { Users } from "@/components/icons/Users";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { H1 } from "@/components/ui/typography";
import { Link } from "expo-router";
import { ScrollView, View } from "react-native";

const cards = [
  {
    label: "Projects",
    route: "/main/projects" as const,
    icon: <Layers />,
  },
  {
    label: "Applications",
    route: "/main/applications" as const,
    icon: <PackageOpen />,
  },
  {
    label: "Servers",
    route: "/main/servers" as const,
    icon: <Server />,
  },
  {
    label: "Teams",
    route: "/main/teams" as const,
    icon: <Users />,
  },
];

export default function MainIndex() {
  return (
    <ScrollView className="p-6 gap-4">
      <H1>Main Dashboard</H1>
      <View className="flex flex-row flex-wrap">
        {cards.map((card) => (
          <Link key={card.label} href={card.route} className="flex w-1/2 p-2">
            <Card className="w-full">
              <CardHeader className="flex items-center justify-center">
                <CardTitle>{card.icon}</CardTitle>
                <CardDescription className="text-lg font-semibold">
                  {card.label}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}
