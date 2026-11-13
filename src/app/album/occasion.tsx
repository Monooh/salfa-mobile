import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Screen, TopBar, useT } from "@/components/ui";
import { OccasionTile } from "@/components/occasion-tile";

export default function OccasionScreen() {
  const s = useT();
  return (
    <Screen>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <TopBar title={s.pickOccasion} sub={s.pickSub} step={1} />
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 12 }}>
          <OccasionTile id="travel" badge={s.mostLoved} style={{ minHeight: 170 }} />
          <View style={{ flexDirection: "row", gap: 12 }}>
            <OccasionTile id="birthday" style={{ flex: 1 }} />
            <OccasionTile id="baby" style={{ flex: 1 }} />
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <OccasionTile id="family" style={{ flex: 1 }} />
            <OccasionTile id="anniversary" style={{ flex: 1 }} />
          </View>
          <OccasionTile id="artwork" style={{ minHeight: 96 }} />
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}
