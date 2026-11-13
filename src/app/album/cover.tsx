import React, { useEffect } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Screen, TopBar, Button, CtaBar, Hint, useT } from "@/components/ui";
import { AlbumCover } from "@/components/album-cover";
import { useAlbum } from "@/lib/album-store";
import { color, coverPalette } from "@/theme/tokens";

const defaultTitle: Record<string, { en: string; ar: string }> = {
  travel: { en: "Our trip", ar: "رحلتنا" },
  birthday: { en: "Happy birthday", ar: "عيد ميلاد سعيد" },
  baby: { en: "My first memories", ar: "أول ذكرياتي" },
  family: { en: "Our family", ar: "عائلتنا" },
  anniversary: { en: "Our memories", ar: "ذكرياتنا" },
  artwork: { en: "My artwork", ar: "رسوماتي" },
};

export default function CoverScreen() {
  const s = useT();
  const a = useAlbum();
  const { width } = useWindowDimensions();
  const size = Math.min(width - 40, 420);

  useEffect(() => {
    if (!a.cover.title && a.occasion) a.setCover({ title: defaultTitle[a.occasion][a.locale] });
  }, [a.occasion, a.locale]);

  const photo = a.photos[a.cover.photo] ?? a.photos[0];

  return (
    <Screen>
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <TopBar title={s.coverT} sub={s.coverSub} step={4} />
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
            <AlbumCover cover={a.cover} photoUri={photo?.uri} size={size} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 12 }}>
              {coverPalette.map(([bg], i) => (
                <Pressable key={i} onPress={() => a.setCover({ color: i })} style={[styles.sw, { backgroundColor: bg }, i === a.cover.color && styles.swOn]} />
              ))}
            </ScrollView>
            <Field label={s.title} value={a.cover.title} onChange={(title) => a.setCover({ title })} />
            <Field label={s.name} value={a.cover.name} onChange={(name) => a.setCover({ name })} placeholder={a.locale === "ar" ? "نور" : "Noor"} />
            <Field label={s.year} value={a.cover.year} onChange={(year) => a.setCover({ year })} keyboard="number-pad" />
            <Hint text={`${s.coverPhoto}: ${a.locale === "ar" ? "اضغط على صورة في الصفحات لاستخدامها" : "tap a photo in the pages to use it"}`} />
          </ScrollView>
          <CtaBar>
            <Button label={`${s.next} →`} onPress={() => router.push("/album/review")} />
          </CtaBar>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Screen>
  );
}

function Field({ label, value, onChange, placeholder, keyboard }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; keyboard?: "default" | "number-pad" }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#9AA0BA" keyboardType={keyboard} style={styles.input} />
    </View>
  );
}

const styles = StyleSheet.create({
  sw: { width: 38, height: 38, borderRadius: 19, borderWidth: 3, borderColor: "#fff", shadowColor: "#0E1330", shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  swOn: { borderColor: color.blue },
  fieldLabel: { fontSize: 12, fontWeight: "800", color: color.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  input: { height: 50, borderRadius: 14, borderWidth: 1, borderColor: color.line, backgroundColor: "#fff", paddingHorizontal: 14, fontSize: 16, fontWeight: "600", color: color.ink },
});
