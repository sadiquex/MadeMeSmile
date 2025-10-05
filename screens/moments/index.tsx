import { Container } from "@/components/ui/container";
import ScreenHeader, { HeaderHeightSpace } from "@/components/ui/screen-header";
import { MomentsListSkeleton } from "@/components/ui/skeleton";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getMoments,
  getMomentsByCategory,
} from "../../services/moments/moments.service";
import { Category, DEFAULT_CATEGORIES, Moment } from "../../types";
import SmileCard from "./smile-card";

export default function MomentsComponent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [moments, setMoments] = useState<Moment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;

  const fetchMoments = async () => {
    try {
      setError(null);
      const fetchedMoments = await getMoments();

      setMoments(fetchedMoments);
    } catch (err) {
      console.error("Error fetching moments:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch moments");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMomentsByCategory = async (category: string) => {
    try {
      setError(null);
      const fetchedMoments = await getMomentsByCategory(category);
      setMoments(fetchedMoments);
    } catch (err) {
      console.error("Error fetching moments by category:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch moments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (selectedCategory === "all") {
      await fetchMoments();
    } else {
      await fetchMomentsByCategory(selectedCategory);
    }
    setIsRefreshing(false);
  };

  const refetchMoments = useCallback(async () => {
    if (selectedCategory === "all") {
      await fetchMoments();
    } else {
      await fetchMomentsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    setIsLoading(true);

    if (category === "all") {
      await fetchMoments();
    } else {
      await fetchMomentsByCategory(category);
    }
  };

  useEffect(() => {
    fetchMoments();
  }, []);

  // Refetch data when screen comes into focus (e.g., returning from add moment screen)
  useFocusEffect(
    useCallback(() => {
      // Only refetch if we're not already loading
      if (!isLoading) {
        // Small delay to prevent excessive refetching
        const timeoutId = setTimeout(() => {
          refetchMoments();
        }, 100);

        return () => clearTimeout(timeoutId);
      }
    }, [isLoading, refetchMoments])
  );

  const filteredMoments = moments;

  const renderMomentsList = () => {
    return filteredMoments.map((moment: Moment) => (
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
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
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
                onPress={() => handleCategoryChange("all")}
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
                  onPress={() => handleCategoryChange(category.id)}
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
                <TouchableOpacity
                  className="bg-red-500 rounded-lg px-6 py-3"
                  onPress={handleRefresh}
                >
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
