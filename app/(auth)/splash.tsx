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
    const checkAuthAndNavigate = async () => {
      try {
        // Wait for auth state to be determined
        if (!loading) {
          // Simulate loading time for better UX
          setTimeout(() => {
            if (user) {
              // User is authenticated, go to main app
              router.replace("/(tabs)");
            } else {
              // User is not authenticated, check onboarding status
              checkOnboardingStatus();
            }
          }, 2000);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        // Default to onboarding if there's an error
        setTimeout(() => {
          router.replace("/(auth)/onboarding");
        }, 2000);
      }
    };

    const checkOnboardingStatus = async () => {
      try {
        // Check if user has completed onboarding
        const onboardingCompleted = await hasCompletedOnboarding();

        if (onboardingCompleted) {
          // User has completed onboarding, go to login
          router.replace("/(auth)/login");
        } else {
          // First time user, show onboarding
          router.replace("/(auth)/onboarding");
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // Default to onboarding if there's an error
        router.replace("/(auth)/onboarding");
      }
    };

    checkAuthAndNavigate();
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
