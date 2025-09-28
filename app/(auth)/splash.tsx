// import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { CameraSmile01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

export default function SplashScreen() {
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        // Check if user has completed onboarding
        // const hasCompletedOnboarding = await AsyncStorage.getItem(
        //   "hasCompletedOnboarding"
        // );

        const hasCompletedOnboarding = false;

        // Simulate loading time
        setTimeout(() => {
          if (hasCompletedOnboarding) {
            // User has completed onboarding, go to login
            router.replace("/(auth)/login");
          } else {
            // First time user, show onboarding
            router.replace("/(auth)/onboarding");
          }
        }, 2000);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // Default to onboarding if there's an error
        setTimeout(() => {
          router.replace("/(auth)/onboarding");
        }, 2000);
      }
    };

    checkOnboardingStatus();
  }, []);

  return (
    <>
      <View className="flex-1 bg-red-400 items-center justify-center">
        <View className="items-center gap-4">
          {/* <Image
          source={require("@/assets/images/icon.png")}
          className="w-24 h-24 mb-8"
          resizeMode="contain"
        /> */}
          <HugeiconsIcon icon={CameraSmile01Icon} size={60} color="#fff" />
          <Text className="text-white text-3xl font-sora-bold">
            MadeMeSmile
          </Text>
          <Text className="text-white text-lg font-sora">
            Spreading joy, one smile at a time
          </Text>
        </View>
        <ActivityIndicator size="large" color="#fff" className="mt-8" />
      </View>
    </>
  );
}
