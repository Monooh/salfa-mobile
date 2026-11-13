import React from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { router } from "expo-router";
import { occasionColors } from "@/theme/tokens";
import { useAlbum, type Occasion } from "@/lib/album-store";
import { useT } from "@/components/ui";

/**
 * A solid product colour instead of a gradient: expo-linear-gradient is one
 * more native module, and on a 160pt tile the second stop is not worth it.
 * The circle highlight gives the depth the web's gradient gave.
 */
export function OccasionTile({ id, style, badge }: { id: Occasion; style?: StyleProp<ViewStyle>; badge?: string }) {
  const s = useT();
  const a = useAlbum();
  const c = occasionColors[id];
  const label = s[id];
  const sub = s[`${id}S` as keyof typeof s] as string;
  return (
    <Pressable
      onPress={() => {
        a.pick(id);
        router.push("/album/pages");
      }}
      style={({ pressed }) => [styles.tile, { backgroundColor: c.from }, pressed && { transform: [{ scale: 0.97 }] }, style]}
    >
      <View style={[styles.circle, { backgroundColor: c.to, opacity: 0.55 }]} />
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
      <View style={{ flex: 1 }} />
      <Text style={[styles.title, { color: c.ink }]}>{label}</Text>
      <Text style={[styles.sub, { color: c.ink }]}>{sub}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: { borderRadius: 22, padding: 16, minHeight: 124, overflow: "hidden", shadowColor: "#0E1330", shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  circle: { position: "absolute", right: -40, top: -50, width: 150, height: 150, borderRadius: 75 },
  title: { fontSize: 18, fontWeight: "800", letterSpacing: -0.3 },
  sub: { fontSize: 12, fontWeight: "500", opacity: 0.9, marginTop: 1 },
  badge: { position: "absolute", top: 14, left: 14, backgroundColor: "#FFCE1F", paddingHorizontal: 9, paddingVertical: 5, borderRadius: 99 },
  badgeText: { fontSize: 10, fontWeight: "900", letterSpacing: 1, color: "#4A3800", textTransform: "uppercase" },
});
