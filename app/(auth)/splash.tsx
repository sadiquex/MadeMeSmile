import { useAuth } from "@/contexts/AuthContext";
import { hasCompletedOnboarding } from "@/services/auth/auth.service";
import { CameraSmile01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function SplashScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    const checkAndNavigate = async () => {
      try {
        await new Promise((r) => setTimeout(r, 2000));
        if (!loading) {
          if (user) {
            router.replace("/(tabs)");
          } else {
            const onboardingCompleted = await hasCompletedOnboarding();
            if (onboardingCompleted) {
              router.replace("/(auth)/login");
            } else {
              router.replace("/(auth)/onboarding");
            }
          }
        }
      } catch (error) {
        console.error("Splash error:", error);
        router.replace("/(auth)/onboarding");
      }
    };

    checkAndNavigate();
  }, [user, loading]);

  return (
    <View className="flex-1 bg-red-400 items-center justify-center">
      <View className="items-center gap-4">
        <HugeiconsIcon icon={CameraSmile01Icon} size={60} color="#fff" />
        <Text className="text-white text-3xl font-sora-bold">MadeMeSmile</Text>
        <Text className="text-white text-lg font-sora">
          Spreading joy, one smile at a time
        </Text>
      </View>
      <ActivityIndicator size="large" color="#fff" className="mt-8" />
    </View>
  );
}
