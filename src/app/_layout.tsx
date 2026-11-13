import React from "react";
import { I18nManager } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AlbumProvider } from "@/lib/album-store";
import { color } from "@/theme/tokens";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AlbumProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: color.bg },
            animation: I18nManager.isRTL ? "slide_from_left" : "slide_from_right",
          }}
        />
      </AlbumProvider>
    </SafeAreaProvider>
  );
}
