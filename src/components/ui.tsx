import React from "react";
import { Pressable, StyleSheet, Text, View, type ViewStyle, type StyleProp, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { color, radius, shadow } from "@/theme/tokens";
import { useAlbum } from "@/lib/album-store";
import { t } from "@/lib/i18n";

export function Screen({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

export function TopBar({ title, sub, step, back = true }: { title: string; sub?: string; step?: number; back?: boolean }) {
  const { locale } = useAlbum();
  const rtl = locale === "ar";
  return (
    <View style={styles.topbar}>
      {back ? (
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back} hitSlop={8}>
          <Text style={[styles.backGlyph, rtl && { transform: [{ scaleX: -1 }] }]}>‹</Text>
        </Pressable>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.h1}>{title}</Text>
        {sub ? <Text style={styles.sub}>{sub}</Text> : null}
      </View>
      {step ? (
        <View style={styles.dots}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={[styles.dot, i <= step && styles.dotOn]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export function Button({
  label,
  onPress,
  kind = "primary",
  disabled,
  loading,
  style,
}: {
  label: string;
  onPress: () => void;
  kind?: "primary" | "yellow" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        kind === "primary" && styles.btnPrimary,
        kind === "yellow" && styles.btnYellow,
        kind === "ghost" && styles.btnGhost,
        (disabled || loading) && { opacity: 0.45 },
        pressed && { transform: [{ scale: 0.99 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={kind === "primary" ? "#fff" : color.ink} />
      ) : (
        <Text style={[styles.btnLabel, kind === "primary" && { color: "#fff" }, kind === "yellow" && { color: color.yellowInk }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export function CtaBar({ children }: { children: React.ReactNode }) {
  return <View style={styles.ctaBar}>{children}</View>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Hint({ text }: { text: string }) {
  return (
    <View style={styles.hint}>
      <Text style={styles.hintText}>{text}</Text>
    </View>
  );
}

export function useT() {
  const { locale } = useAlbum();
  return t(locale);
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  topbar: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingTop: 6, paddingBottom: 14 },
  back: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: color.surface, borderWidth: 1, borderColor: color.line,
    alignItems: "center", justifyContent: "center", ...shadow.card,
  },
  backGlyph: { fontSize: 26, lineHeight: 28, color: color.ink, fontWeight: "700", marginTop: -2 },
  h1: { fontSize: 22, fontWeight: "800", color: color.ink, letterSpacing: -0.4 },
  sub: { fontSize: 13, color: color.muted, fontWeight: "500", marginTop: 2 },
  dots: { flexDirection: "row", gap: 5 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#D9DDEB" },
  dotOn: { width: 18, backgroundColor: color.blue },
  btn: { height: 56, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, width: "100%" },
  btnPrimary: { backgroundColor: color.blue, ...shadow.cta },
  btnYellow: { backgroundColor: color.yellow, shadowColor: color.yellow, shadowOpacity: 0.35, shadowRadius: 18, shadowOffset: { width: 0, height: 10 } },
  btnGhost: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.line, height: 48, ...shadow.card },
  btnLabel: { fontSize: 16, fontWeight: "800", color: color.ink },
  ctaBar: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16, backgroundColor: color.bg, gap: 10 },
  card: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.line, borderRadius: radius.card, padding: 16, ...shadow.card },
  hint: { backgroundColor: "#EEF0F8", borderRadius: 12, padding: 12, marginTop: 12 },
  hintText: { fontSize: 12, color: color.muted, lineHeight: 17 },
});
