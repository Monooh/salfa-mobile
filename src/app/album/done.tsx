import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Screen, Button, Card, useT } from "@/components/ui";
import { useAlbum } from "@/lib/album-store";
import { formatPrice } from "@/lib/i18n";
import { color } from "@/theme/tokens";

export default function DoneScreen() {
  const s = useT();
  const a = useAlbum();
  const { order } = useLocalSearchParams<{ order: string }>();
  const steps = [
    { k: s.paid, v: s.paidS, state: "done" },
    { k: s.printing, v: s.printingS, state: "now" },
    { k: s.shipped, v: s.shippedS, state: "" },
    { k: s.delivered, v: s.deliveredS, state: "" },
  ];
  return (
    <Screen>
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}>
          <View style={styles.ok}>
            <Text style={{ fontSize: 34, color: color.success, fontWeight: "900" }}>✓</Text>
          </View>
          <Text style={styles.h}>{s.thanks}</Text>
          <Text style={styles.p}>{s.thanksSub}</Text>
          <Card>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "800", color: color.ink }}>{s.order} {order ?? ""}</Text>
                <Text style={{ color: color.muted, fontSize: 13 }}>
                  {a.occasion ? s[a.occasion] : ""} · {a.pages} {s.pages} · {formatPrice(a.market, a.pages, a.locale)}
                </Text>
              </View>
              <View style={styles.pill}>
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "800" }}>{s.paid}</Text>
              </View>
            </View>
            <Text style={{ fontWeight: "800", fontSize: 17, color: color.ink, marginTop: 18, marginBottom: 12 }}>{s.track}</Text>
            {steps.map((st, i) => (
              <View key={i} style={{ flexDirection: "row", gap: 14, paddingBottom: i < steps.length - 1 ? 22 : 0 }}>
                <View style={{ alignItems: "center" }}>
                  <View style={[styles.dot, st.state === "done" && { backgroundColor: color.blue, borderColor: color.blue }, st.state === "now" && { backgroundColor: color.yellow, borderColor: color.yellow }]}>
                    {st.state === "done" ? <Text style={{ color: "#fff", fontSize: 12, fontWeight: "900" }}>✓</Text> : null}
                  </View>
                  {i < steps.length - 1 ? <View style={styles.line} /> : null}
                </View>
                <View>
                  <Text style={{ fontWeight: "800", fontSize: 15, color: color.ink }}>{st.k}</Text>
                  <Text style={{ color: color.muted, fontSize: 13 }}>{st.v}</Text>
                </View>
              </View>
            ))}
          </Card>
          <Button
            kind="ghost"
            label={s.another}
            style={{ marginTop: 16 }}
            onPress={() => {
              a.reset();
              router.dismissAll();
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  ok: { width: 76, height: 76, borderRadius: 38, backgroundColor: color.successBg, alignItems: "center", justifyContent: "center", alignSelf: "center", marginTop: 24, marginBottom: 10 },
  h: { fontSize: 30, fontWeight: "900", textAlign: "center", color: color.ink, letterSpacing: -1 },
  p: { textAlign: "center", color: color.muted, fontSize: 15, lineHeight: 22, marginTop: 6, marginBottom: 18 },
  pill: { backgroundColor: color.blue, paddingHorizontal: 10, height: 28, borderRadius: 99, justifyContent: "center" },
  dot: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: color.line, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  line: { width: 2, flex: 1, backgroundColor: color.line, marginTop: 2 },
});
