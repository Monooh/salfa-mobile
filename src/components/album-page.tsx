/**
 * Draws one album page from a layout Page.
 *
 * Each cell shows the photo whole (contain). Behind it sits the same photo,
 * scaled to cover and blurred, so whatever the shape leaves uncovered is a
 * soft wash of the photo's own colours rather than white. This is the
 * "no crop, no white holes" rule made visible; print renders the same way.
 */
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { resolveRects, type Page } from "@/lib/album-layout";
import { color } from "@/theme/tokens";

export function AlbumPage({
  page,
  size,
  number,
  onPressPhoto,
  radius = 14,
}: {
  page: Page;
  size: number;
  number?: number;
  onPressPhoto?: (uri: string) => void;
  radius?: number;
}) {
  const pad = Math.max(3, size * 0.018);
  const gap = Math.max(2, size * 0.016);
  const rects = resolveRects(page.template, size, gap, pad);
  return (
    <View style={[styles.page, { width: size, height: size, borderRadius: radius }]}>
      {page.photos.map((p, i) => {
        const r = rects[i];
        const cell = (
          <View style={[styles.cell, { left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: Math.max(3, radius * 0.5) }]}>
            <Image source={{ uri: p.uri }} style={StyleSheet.absoluteFill} contentFit="cover" blurRadius={18} cachePolicy="memory-disk" />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(255,255,255,0.35)" }]} />
            <Image source={{ uri: p.uri }} style={StyleSheet.absoluteFill} contentFit="contain" cachePolicy="memory-disk" transition={120} />
          </View>
        );
        return onPressPhoto ? (
          <Pressable key={p.uri + i} onPress={() => onPressPhoto(p.uri)} style={StyleSheet.absoluteFill} pointerEvents="box-none">
            {cell}
          </Pressable>
        ) : (
          <React.Fragment key={p.uri + i}>{cell}</React.Fragment>
        );
      })}
      {number ? (
        <View style={styles.no}>
          <Text style={styles.noText}>{number}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: color.ink,
    shadowOpacity: 0.14,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
  cell: { position: "absolute", overflow: "hidden", backgroundColor: "#EEF0F8" },
  no: { position: "absolute", bottom: 8, right: 10, backgroundColor: "rgba(255,255,255,0.8)", paddingHorizontal: 7, paddingVertical: 2, borderRadius: 99 },
  noText: { fontSize: 10, fontWeight: "800", color: "rgba(14,19,48,0.5)" },
});
