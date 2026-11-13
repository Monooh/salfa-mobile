import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Screen, Card, useT, styles as ui } from "@/components/ui";
import { OccasionTile } from "@/components/occasion-tile";
import { useAlbum } from "@/lib/album-store";
import { formatPrice } from "@/lib/i18n";
import { color } from "@/theme/tokens";

export default function Home() {
  const s = useT();
  const a = useAlbum();
  return (
    <Screen>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
          <View style={[ui.topbar, { paddingHorizontal: 0 }]}>
            <Text style={styles.wordmark}>
              Salfa<Text style={{ color: color.yellow }}>.</Text>
            </Text>
            <View style={{ flex: 1 }} />
            <Chip on={a.market === "KW"} label="KW" onPress={() => a.setMarket("KW")} />
            <Chip on={a.market === "SA"} label="SA" onPress={() => a.setMarket("SA")} />
            <Chip label={a.locale === "en" ? "العربية" : "English"} onPress={() => a.setLocale(a.locale === "en" ? "ar" : "en")} />
          </View>
          <Text style={styles.hero}>{a.locale === "ar" ? "كل ذكرى لها سالفة" : "Every memory has a story"}</Text>
          <View style={styles.sec}>
            <Text style={styles.secTitle}>{s.albums}</Text>
            <Pressable onPress={() => router.push("/album/occasion")}>
              <Text style={{ color: color.blue, fontWeight: "700", fontSize: 13 }}>{a.locale === "ar" ? "كل المناسبات" : "All occasions"}</Text>
            </Pressable>
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <OccasionTile id="travel" style={{ flex: 1 }} />
            <OccasionTile id="birthday" style={{ flex: 1 }} />
          </View>
          <Card style={{ marginTop: 12, flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "800", fontSize: 15, color: color.ink }}>{s.size}</Text>
              <Text style={{ color: color.muted, fontSize: 13 }}>{s.p20} · {s.p20s}</Text>
            </View>
            <Text style={styles.price}>{formatPrice(a.market, 20, a.locale)}</Text>
          </Card>
          <View style={styles.sec}>
            <Text style={styles.secTitle}>{s.artwork}</Text>
          </View>
          <OccasionTile id="artwork" style={{ minHeight: 96 }} />
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}

function Chip({ label, on, onPress }: { label: string; on?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, on && { backgroundColor: color.blue, borderColor: color.blue }]}>
      <Text style={[styles.chipText, on && { color: "#fff" }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wordmark: { fontSize: 26, fontWeight: "900", letterSpacing: -1, color: color.ink },
  hero: { fontSize: 30, fontWeight: "900", letterSpacing: -1, color: color.ink, lineHeight: 33, marginTop: 6 },
  sec: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginTop: 18, marginBottom: 10 },
  secTitle: { fontSize: 17, fontWeight: "800", color: color.ink },
  price: { fontSize: 20, fontWeight: "900", color: color.ink },
  chip: { height: 30, paddingHorizontal: 10, borderRadius: 99, borderWidth: 1, borderColor: color.line, backgroundColor: "#fff", justifyContent: "center", marginLeft: 6 },
  chipText: { fontSize: 12, fontWeight: "700", color: color.ink },
});
