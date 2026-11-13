import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { coverPalette } from "@/theme/tokens";
import type { Cover } from "@/lib/album-store";

export function AlbumCover({ cover, photoUri, size }: { cover: Cover; photoUri?: string; size: number }) {
  const [bg, ink] = coverPalette[cover.color] ?? coverPalette[0];
  const f = size / 320;
  return (
    <View style={[styles.cover, { width: size, height: size, backgroundColor: bg, padding: size * 0.07 }]}>
      <View style={[styles.photo, { left: size * 0.05, top: size * 0.05, width: size * 0.9, height: size * 0.66 }]}>
        {photoUri ? (
          <>
            <Image source={{ uri: photoUri }} style={StyleSheet.absoluteFill} contentFit="cover" blurRadius={14} />
            <Image source={{ uri: photoUri }} style={StyleSheet.absoluteFill} contentFit="contain" />
          </>
        ) : null}
      </View>
      <View style={{ flex: 1 }} />
      <Text numberOfLines={2} style={{ color: ink, fontSize: 30 * f, fontWeight: "900", letterSpacing: -0.5, lineHeight: 32 * f }}>
        {cover.title || " "}
      </Text>
      <Text numberOfLines={1} style={{ color: ink, fontSize: 18 * f, fontWeight: "700", opacity: 0.9, marginTop: 2 * f }}>
        {cover.name || " "}
      </Text>
      <Text style={{ color: ink, fontSize: 13 * f, fontWeight: "700", opacity: 0.75, marginTop: 4 * f, letterSpacing: 1.2 }}>
        {cover.year}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#0E1330",
    shadowOpacity: 0.18,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 16 },
    elevation: 6,
  },
  photo: { position: "absolute", borderRadius: 6, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.15)" },
});
