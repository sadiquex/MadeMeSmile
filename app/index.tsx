import { router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function Index() {
  useEffect(() => {
    // Use a small delay to ensure the Root Layout is mounted
    const timer = setTimeout(() => {
      router.replace("/(auth)/splash");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Return a minimal loading view instead of null
  return <View className="flex-1 bg-blue-500" />;
}
