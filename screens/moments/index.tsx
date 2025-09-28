import { Container } from "@/components/ui/container";
import ScreenHeader, { HeaderHeightSpace } from "@/components/ui/screen-header";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Category, Moment } from "../../types";
import { DUMMY_CATEGORIES, DUMMY_MOMENTS } from "./dummy-data";
import SmileCard from "./smile-card";

export default function MomentsComponent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;

  const filteredMoments =
    selectedCategory === "all"
      ? DUMMY_MOMENTS
      : DUMMY_MOMENTS.filter(
          (moment: Moment) => moment.category === selectedCategory
        );

  const renderMomentsList = () => {
    return filteredMoments.map((moment: Moment) => (
      <View key={moment.id} className="mb-4 pb-[90px]">
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
                onPress={() => setSelectedCategory("all")}
              >
                <Text
                  className={`font-sora-medium text-sm ${
                    selectedCategory === "all" ? "text-white" : "text-gray-700"
                  }`}
                >
                  All
                </Text>
              </TouchableOpacity>

              {DUMMY_CATEGORIES.map((category: Category) => (
                <TouchableOpacity
                  key={category.id}
                  className={`${
                    selectedCategory === category.id
                      ? "bg-red-500"
                      : "bg-white border border-gray-300"
                  } rounded-full px-4 py-2.5 flex-row items-center`}
                  onPress={() => setSelectedCategory(category.id)}
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
            {filteredMoments.length === 0 ? (
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
