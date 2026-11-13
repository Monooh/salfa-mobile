import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { Screen, TopBar, Button, CtaBar, useT } from "@/components/ui";
import { useAlbum } from "@/lib/album-store";
import { color } from "@/theme/tokens";

export default function PhotosScreen() {
  const s = useT();
  const a = useAlbum();
  const [busy, setBusy] = useState(false);
  const n = a.photos.length;
  const left = a.capacity - n;
  const ready = n >= a.minPhotos;

  async function pickPhotos() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    setBusy(true);
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: Math.max(1, left),
        orderedSelection: true,
        quality: 0.9,
        exif: false,
      });
      if (!res.canceled) {
        a.addPhotos(res.assets.map((x) => ({ uri: x.uri, width: x.width, height: x.height })));
      }
    } finally {
      setBusy(false);
    }
  }

  function next() {
    a.relayout(0);
    router.push("/album/preview");
  }

  return (
    <Screen>
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
        <TopBar title={s.addPhotos} sub={s.addSub} step={3} />
        <View style={{ paddingHorizontal: 20 }}>
          <Button label={s.fromPhone} onPress={pickPhotos} loading={busy} disabled={left <= 0} style={{ height: 50 }} />
          <View style={styles.counter}>
            <Text style={styles.counterText}>
              <Text style={{ color: color.ink, fontWeight: "900" }}>{n}</Text> / {a.capacity} {s.photos}
            </Text>
            <Text style={[styles.counterText, ready && { color: color.success }]}>{ready ? `${s.ready} ✓` : s.needMore(a.minPhotos - n)}</Text>
          </View>
          <View style={styles.bar}>
            <View style={[styles.fill, { width: `${Math.min(100, Math.round((n / a.minPhotos) * 100))}%` }, ready && { backgroundColor: color.success }]} />
          </View>
        </View>
        <FlatList
          data={a.photos}
          keyExtractor={(p, i) => p.uri + i}
          numColumns={4}
          contentContainerStyle={{ padding: 20, paddingTop: 12, gap: 6 }}
          columnWrapperStyle={{ gap: 6 }}
          renderItem={({ item, index }) => (
            <Pressable onLongPress={() => a.removePhoto(index)} style={styles.ph}>
              <Image source={{ uri: item.uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
            </Pressable>
          )}
          ListFooterComponent={
            left > 0 ? (
              <Pressable onPress={pickPhotos} style={[styles.ph, styles.add, { marginTop: n % 4 === 0 ? 0 : 6 }]}>
                <Text style={{ color: color.blue, fontSize: 26, fontWeight: "900" }}>+</Text>
              </Pressable>
            ) : undefined
          }
        />
        <CtaBar>
          <Button label={`${s.next} →`} onPress={next} disabled={!ready} />
        </CtaBar>
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  counter: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  counterText: { fontSize: 13, color: color.muted, fontWeight: "600" },
  bar: { height: 8, borderRadius: 99, backgroundColor: "#E7EAF3", overflow: "hidden", marginTop: 6 },
  fill: { height: "100%", backgroundColor: color.blue, borderRadius: 99 },
  ph: { flex: 1, aspectRatio: 1, borderRadius: 10, overflow: "hidden", backgroundColor: "#EEF0F8", maxWidth: "24%" },
  add: { borderWidth: 2, borderStyle: "dashed", borderColor: "#C9CEE2", backgroundColor: "#fff", alignItems: "center", justifyContent: "center", width: "24%" },
});
