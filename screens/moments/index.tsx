import { Container } from "@/components/ui/container";
import ScreenHeader, { HeaderHeightSpace } from "@/components/ui/screen-header";
import { MomentsListSkeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/utils";
import { getMoments } from "@/services/moments/moments.service";
import { IMoment } from "@/services/moments/moments.types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Category, DEFAULT_CATEGORIES } from "../../types";
import SmileCard from "./smile-card";

export default function MomentsComponent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [moments, setMoments] = useState<IMoment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;

  const fetchMoments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMoments();
      setMoments(response.data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMoments();
  }, []);

  const filteredMoments = moments;

  const renderMomentsList = () => {
    return filteredMoments.map((moment: IMoment) => (
      <View key={moment.id} className="mb-4">
        <SmileCard moment={moment} />
      </View>
    ));
  };

  const handleAddMoment = () => {
    router.push("/(tabs)/add-moment");
  };

  return (
    <>
      <ScreenHeader title="Moments" />

      <Container>
        <ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={isRefreshing} />}
        >
          {/* empty space to prevent header from covering the content */}
          <HeaderHeightSpace style={{ height: 110 }} />

          {/* Category Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            className="max-h-10 mb-4"
          >
            <View className="flex-row gap-2">
              <TouchableOpacity
                className={`${
                  selectedCategory === "all"
                    ? "bg-red-500"
                    : "bg-white border border-gray-300"
                } rounded-full px-4 py-2.5 flex-row items-center`}
              >
                <Text
                  className={`font-sora-medium text-sm ${
                    selectedCategory === "all" ? "text-white" : "text-gray-700"
                  }`}
                >
                  All
                </Text>
              </TouchableOpacity>

              {DEFAULT_CATEGORIES.map((category: Category) => (
                <TouchableOpacity
                  key={category.id}
                  className={`${
                    selectedCategory === category.id
                      ? "bg-red-500"
                      : "bg-white border border-gray-300"
                  } rounded-full px-4 py-2.5 flex-row items-center`}
                >
                  <Text
                    className={`font-sora-medium text-sm ${
                      selectedCategory === category.id
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Moments List */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {isLoading ? (
              <MomentsListSkeleton count={3} showMedia={true} />
            ) : error ? (
              <View className="flex-1 items-center justify-center py-20">
                <Ionicons
                  name="alert-circle-outline"
                  size={64}
                  color="#EF4444"
                />
                <Text className="font-sora-bold text-gray-900 text-xl mt-4 mb-2">
                  Error loading moments
                </Text>
                <Text className="font-sora text-gray-600 text-center px-8 mb-4">
                  {error}
                </Text>
                <TouchableOpacity className="bg-red-500 rounded-lg px-6 py-3">
                  <Text className="font-sora-medium text-white">Try Again</Text>
                </TouchableOpacity>
              </View>
            ) : filteredMoments.length === 0 ? (
              <View className="flex-1 items-center justify-center py-20">
                <Ionicons name="heart-outline" size={64} color="#9CA3AF" />
                <Text className="font-sora-bold text-gray-900 text-xl mt-4 mb-2">
                  No moments yet
                </Text>
                <Text className="font-sora text-gray-600 text-center px-8">
                  {selectedCategory === "all"
                    ? "Start creating moments to see them here!"
                    : `No ${selectedCategory} moments yet. Try adding some!`}
                </Text>
              </View>
            ) : (
              renderMomentsList()
            )}
          </ScrollView>
        </ScrollView>
      </Container>

      {/* Floating Add Button */}
      <Animated.View
        style={{
          position: "absolute",
          bottom: 100,
          right: 20,
          opacity: scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 0.3],
            extrapolate: "clamp",
          }),
        }}
      >
        <TouchableOpacity
          onPress={handleAddMoment}
          className="h-14 w-14 items-center justify-center rounded-2xl bg-red-500 shadow-lg"
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}
