import ScreenHeader, { HeaderHeightSpace } from "@/components/ui/screen-header";
import { useAuth } from "@/contexts/AuthContext";
import SmilesStreaksChart from "@/screens/profile/smiles-streaks-chart";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { MomentService } from "../../services/MomentService";

export default function ProfileScreenComponent() {
  const [stats, setStats] = useState({
    totalMoments: 0,
    momentsThisWeek: 0,
    momentsThisMonth: 0,
    categoryCounts: {} as Record<string, number>,
  });
  const { user, signOut } = useAuth();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const momentStats = await MomentService.getMomentStats();
      setStats(momentStats);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/(auth)/splash");
          } catch (error) {
            console.error("Logout error:", error);
            Toast.show({
              type: "error",
              text1: "Logout failed",
              text2: "Please try again",
            });
          }
        },
      },
    ]);
  };

  const profileOptions = [
    { title: "My Moments", icon: "document-text", onPress: () => {} },
    { title: "Categories", icon: "folder", onPress: () => {} },
    { title: "Settings", icon: "settings", onPress: () => {} },
    { title: "Help & Support", icon: "help-circle", onPress: () => {} },
    { title: "About", icon: "information-circle", onPress: () => {} },
  ];

  return (
    <>
      <ScreenHeader title={user?.displayName || user?.email || "Profile"} />

      <ScrollView className="flex-1">
        <HeaderHeightSpace style={{ height: 40 }} />

        <View className="px-4 py-6">
          {/* Profile Header */}
          <View className="bg-white border border-gray-200 rounded-lg p-4 flex flex-row gap-2">
            <View className="w-20 h-20 bg-yellow-500 rounded-full items-center justify-center mb-4">
              <Ionicons name="person" size={32} color="white" />
            </View>

            <View className="flex-col gap-4">
              <Text className="font-sora text-gray-600">
                {user?.displayName || user?.email || "User"}
              </Text>

              {/* Stats */}
              <View className="flex-row gap-6">
                <View className="items-start">
                  <Text className="text-lg font-sora-bold text-gray-900">
                    {stats.totalMoments}
                  </Text>
                  <Text className="font-sora text-gray-600 text-xs">
                    Moments
                  </Text>
                </View>
                <View className="items-start">
                  <Text className="text-lg font-sora-bold text-gray-900">
                    {stats.momentsThisWeek}
                  </Text>
                  <Text className="font-sora text-gray-600 text-xs">
                    This Week
                  </Text>
                </View>
                <View className="items-start">
                  <Text className="text-lg font-sora-bold text-gray-900">
                    {stats.momentsThisMonth}
                  </Text>
                  <Text className="font-sora text-gray-600 text-xs">
                    This Month
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Smiles Streaks Chart */}
          <SmilesStreaksChart
            onCellPress={(date, count) => {
              console.log(`Date: ${date}, Smiles: ${count}`);
              // TODO: Navigate to day's moments or show details
            }}
          />

          {/* Category Breakdown */}
          {Object.keys(stats.categoryCounts).length > 0 && (
            <View className="mb-6">
              <Text className="font-sora-bold text-gray-900 text-lg mb-4">
                Your Moments by Category
              </Text>
              <View className="bg-white rounded-lg p-4">
                {Object.entries(stats.categoryCounts).map(
                  ([category, count]) => (
                    <View
                      key={category}
                      className="flex-row items-center justify-between py-2"
                    >
                      <Text className="font-sora-medium text-gray-700 capitalize">
                        {category}
                      </Text>
                      <Text className="font-sora text-gray-500">
                        {count} moment{count !== 1 ? "s" : ""}
                      </Text>
                    </View>
                  ),
                )}
              </View>
            </View>
          )}

          {/* Profile Options */}
          <View className="mb-6">
            <Text className="font-sora-bold text-gray-900 text-lg mb-4">
              Account
            </Text>
            <View className="bg-white rounded-lg">
              {profileOptions.map((option, index) => (
                <TouchableOpacity
                  key={option.title}
                  className={`flex-row items-center px-4 py-4 ${
                    index !== profileOptions.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }`}
                  onPress={option.onPress}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={20}
                    color="#6B7280"
                  />
                  <Text className="ml-3 font-sora-medium text-gray-900">
                    {option.title}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="#9CA3AF"
                    style={{ marginLeft: "auto" }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            className="bg-red-500 rounded-lg py-4 mb-6"
            onPress={handleLogout}
          >
            <Text className="text-white text-center font-sora-bold text-lg">
              Logout
            </Text>
          </TouchableOpacity>

          {/* App Info */}
          <View className="items-center">
            <Text className="font-sora text-gray-500 text-sm">
              MadeMeSmile v1.0.0
            </Text>
            <Text className="font-sora text-gray-500 text-xs mt-1">
              Spreading joy, one smile at a time
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
