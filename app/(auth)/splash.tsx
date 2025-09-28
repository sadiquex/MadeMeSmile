// import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { Image, Text, View } from "react-native";

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
    <View className="flex-1 bg-blue-500 items-center justify-center">
      <View className="items-center">
        <Image
          source={require("@/assets/images/icon.png")}
          className="w-24 h-24 mb-8"
          resizeMode="contain"
        />
        <Text className="text-white text-3xl font-sora-bold mb-2">
          MadeMeSmile
        </Text>
        <Text className="text-blue-100 text-lg font-sora">
          Spreading joy, one smile at a time
        </Text>
      </View>
    </View>
  );
}
