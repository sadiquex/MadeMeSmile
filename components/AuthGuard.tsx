import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import React, { ReactNode, useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/(auth)/login");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#f87171" />
        <Text className="mt-4 text-gray-600 font-sora">Loading...</Text>
      </View>
    );
  }

  if (!user) {
    if (fallback) return <>{fallback}</>;
    return null;
  }

  return <>{children}</>;
}

export default AuthGuard;
