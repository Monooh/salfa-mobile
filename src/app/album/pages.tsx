import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Screen, TopBar, Button, CtaBar, Card, Hint, useT } from "@/components/ui";
import { useAlbum } from "@/lib/album-store";
import { formatPrice } from "@/lib/i18n";
import { color } from "@/theme/tokens";

export default function PagesScreen() {
  const s = useT();
  const a = useAlbum();
  const art = a.occasion === "artwork";
  return (
    <Screen>
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
        <TopBar title={a.occasion ? s[a.occasion] : s.albums} sub={s.howMany} step={2} />
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <View style={styles.seg}>
            {([20, 40] as const).map((p) => (
              <Pressable key={p} onPress={() => a.setPages(p)} style={[styles.segBtn, a.pages === p && styles.segOn]}>
                <Text style={[styles.segLabel, a.pages === p && { color: color.ink }]}>{p === 20 ? s.p20 : s.p40}</Text>
                <Text style={styles.segSub}>{art ? `${p} ${s.drawings}` : p === 20 ? s.p20s : s.p40s}</Text>
              </Pressable>
            ))}
          </View>
          <Card style={{ marginTop: 16, flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "800", fontSize: 15, color: color.ink }}>{s.size}</Text>
              <Text style={{ color: color.muted, fontSize: 13 }}>{s.deliver}</Text>
            </View>
            <Text style={{ fontSize: 20, fontWeight: "900", color: color.ink }}>{formatPrice(a.market, a.pages, a.locale)}</Text>
          </Card>
          <Hint text={s.noCrop} />
        </View>
        <CtaBar>
          <Button label={`${s.addPhotos} →`} onPress={() => router.push("/album/photos")} />
        </CtaBar>
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  seg: { flexDirection: "row", backgroundColor: "#EEF0F8", borderRadius: 14, padding: 4, gap: 4, marginTop: 6 },
  segBtn: { flex: 1, height: 54, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  segOn: { backgroundColor: "#fff", shadowColor: "#0E1330", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  segLabel: { fontWeight: "800", fontSize: 14, color: color.muted },
  segSub: { fontSize: 11, fontWeight: "600", color: color.muted },
});
