import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Screen, TopBar, Button, CtaBar, Card, useT } from "@/components/ui";
import { AlbumCover } from "@/components/album-cover";
import { AlbumPage } from "@/components/album-page";
import { useAlbum } from "@/lib/album-store";
import { formatPrice } from "@/lib/i18n";
import { color } from "@/theme/tokens";
import { startCheckout } from "@/lib/checkout";

export default function ReviewScreen() {
  const s = useT();
  const a = useAlbum();
  const { width } = useWindowDimensions();
  const [paying, setPaying] = useState(false);
  const photo = a.photos[a.cover.photo] ?? a.photos[0];
  const mini = Math.floor((width - 40 - 4 * 9) / 10);

  async function pay() {
    setPaying(true);
    try {
      const result = await startCheckout({
        occasion: a.occasion!,
        pages: a.pages,
        market: a.market,
        locale: a.locale,
        photos: a.photos,
        layout: a.layout,
        cover: a.cover,
      });
      if (result.status === "paid") router.replace({ pathname: "/album/done", params: { order: result.orderNumber } });
    } finally {
      setPaying(false);
    }
  }

  return (
    <Screen>
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
        <TopBar title={s.review} sub={s.reviewSub} step={5} />
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <View style={{ flexDirection: "row", gap: 14, alignItems: "flex-start" }}>
            <AlbumCover cover={a.cover} photoUri={photo?.uri} size={(width - 54) * 0.42} />
            <View style={{ flex: 1 }}>
              <Row k={s.item} v={a.occasion ? s[a.occasion] : ""} />
              <Row k={s.pages} v={String(a.pages)} />
              <Row k={s.photos} v={String(a.photos.length)} />
              <Row k={s.size.split(",")[0]} v="✓" last />
            </View>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 14 }}>
            {a.layout.slice(0, 10).map((pg, i) => (
              <AlbumPage key={i} page={pg} size={mini} radius={5} />
            ))}
          </View>
          <Card style={{ marginTop: 16, flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "800", fontSize: 15, color: color.ink }}>{s.deliver}</Text>
              <Text style={{ color: color.muted, fontSize: 13 }}>{a.market === "KW" ? "Kuwait" : "Saudi Arabia"} · Tap</Text>
            </View>
            <Text style={{ fontSize: 20, fontWeight: "900", color: color.ink }}>{formatPrice(a.market, a.pages, a.locale)}</Text>
          </Card>
        </ScrollView>
        <CtaBar>
          <Button kind="yellow" label={`${s.pay} ${formatPrice(a.market, a.pages, a.locale)}`} onPress={pay} loading={paying} />
        </CtaBar>
      </SafeAreaView>
    </Screen>
  );
}

function Row({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
      <Text style={{ color: color.muted, fontSize: 14 }}>{k}</Text>
      <Text style={{ color: color.ink, fontSize: 14, fontWeight: "800" }}>{v}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: color.line },
});
