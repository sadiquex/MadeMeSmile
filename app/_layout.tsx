import {
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
} from "@expo-google-fonts/sora";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "../global.css";

// Verify NativeWind installation
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { verifyInstallation } = require("nativewind");
  verifyInstallation();
} catch (error) {
  console.log("NativeWind verification failed:", error);
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="index" />
        </Stack>
        <StatusBar style="auto" />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
