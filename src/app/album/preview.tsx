import React, { useRef, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Screen, TopBar, Button, CtaBar, Hint, useT } from "@/components/ui";
import { AlbumPage } from "@/components/album-page";
import { useAlbum } from "@/lib/album-store";
import { color } from "@/theme/tokens";

export default function PreviewScreen() {
  const s = useT();
  const a = useAlbum();
  const { width } = useWindowDimensions();
  const size = Math.min(width - 40, 420);
  const [current, setCurrent] = useState(0);
  const list = useRef<FlatList>(null);
  const mini = Math.floor((width - 40 - 6 * 4) / 5);

  return (
    <Screen>
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
        <TopBar title={s.preview} sub={s.previewSub} step={3} />
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <FlatList
            ref={list}
            horizontal
            pagingEnabled
            data={a.layout}
            keyExtractor={(_, i) => String(i)}
            showsHorizontalScrollIndicator={false}
            snapToInterval={size + 14}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: 20, gap: 14, paddingVertical: 6 }}
            onMomentumScrollEnd={(e) => setCurrent(Math.round(e.nativeEvent.contentOffset.x / (size + 14)))}
            renderItem={({ item, index }) => (
              <View style={{ width: size }}>
                <AlbumPage
                  page={item}
                  size={size}
                  number={index + 1}
                  onPressPhoto={(uri) => a.setCover({ photo: a.photos.findIndex((p) => p.uri === uri) })}
                />
                <Text style={styles.label}>
                  {s.page} {index + 1} / {a.layout.length}
                </Text>
              </View>
            )}
          />
          <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 20 }}>
            <Button kind="ghost" label={`⤮ ${s.shuffle}`} onPress={() => a.relayout((Date.now() % 90000) + 1)} style={{ flex: 1 }} />
            <Button kind="ghost" label={`+ ${s.addMore}`} onPress={() => router.back()} style={{ flex: 1 }} />
          </View>
          <View style={styles.minis}>
            {a.layout.map((pg, i) => (
              <Pressable
                key={i}
                onPress={() => {
                  list.current?.scrollToIndex({ index: i, animated: true });
                  setCurrent(i);
                }}
                style={[styles.miniWrap, i === current && { borderColor: color.blue }]}
              >
                <AlbumPage page={pg} size={mini - 4} radius={6} />
              </Pressable>
            ))}
          </View>
          <View style={{ paddingHorizontal: 20 }}>
            <Hint text={s.noCrop} />
          </View>
        </ScrollView>
        <CtaBar>
          <Button label={`${s.next} →`} onPress={() => router.push("/album/cover")} />
        </CtaBar>
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { textAlign: "center", fontSize: 12, fontWeight: "700", color: color.muted, marginTop: 10 },
  minis: { flexDirection: "row", flexWrap: "wrap", gap: 6, paddingHorizontal: 20, marginTop: 14 },
  miniWrap: { borderWidth: 2, borderColor: "transparent", borderRadius: 8, padding: 0 },
});
