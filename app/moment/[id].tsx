import ScreenHeader from "@/components/ui/screen-header";
import {
  formatDateAndTime,
  getCategoryColor,
  getCategoryGradientColors,
  getCategoryIcon,
} from "@/lib/utils";
import { DUMMY_MOMENTS } from "@/screens/moments/dummy-data";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useRef } from "react";
import { Animated, Image, ScrollView, Text, View } from "react-native";

export default function MomentDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scrollY = useRef(new Animated.Value(0)).current;
  const imageHeight = 320; // Height of the image section

  // TODO: Replace with actual data fetching

  const moment = DUMMY_MOMENTS.find((moment) => moment.id === id);

  if (!moment) {
    return (
      <View>
        <Text>Moment not found</Text>
      </View>
    );
  }

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case "happy":
        return "😊";
      case "grateful":
        return "🙏";
      case "excited":
        return "🎉";
      case "peaceful":
        return "😌";
      default:
        return "😊";
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="Beautiful Memory" showRightButton showBackButton />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 100 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Media Section with Parallax */}
        <View
          className="relative"
          style={{ height: imageHeight, overflow: "hidden" }}
        >
          <Animated.View
            style={{
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [0, imageHeight],
                    outputRange: [0, -imageHeight * 0.5],
                    extrapolate: "clamp",
                  }),
                },
              ],
            }}
          >
            {moment.mediaUrl && moment.mediaType === "photo" ? (
              <Image
                source={{ uri: moment.mediaUrl }}
                style={{ width: "100%", height: imageHeight * 1.5 }}
                resizeMode="cover"
              />
            ) : (
              <View
                className="w-full bg-gray-100 items-center justify-center"
                style={{ height: imageHeight * 1.5 }}
              >
                <Ionicons
                  name={
                    moment.mediaType === "video"
                      ? "videocam"
                      : moment.mediaType === "audio"
                      ? "mic"
                      : "document-text"
                  }
                  size={64}
                  color="#9CA3AF"
                />
              </View>
            )}
          </Animated.View>

          {/* Gradient Overlay */}
          <LinearGradient
            colors={getCategoryGradientColors(moment.category)}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 120,
            }}
          />

          {/* Category Badge */}
          <View className="absolute top-4 right-4">
            <View
              className={`${getCategoryColor(
                moment.category
              )} rounded-full px-3 py-1 flex-row items-center`}
            >
              <Ionicons
                name={getCategoryIcon(moment.category) as any}
                size={12}
                color="white"
              />
              <Text className="font-sora-medium text-white text-xs ml-1">
                {moment.category.charAt(0).toUpperCase() +
                  moment.category.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View className="p-4">
          {/* Full Content */}
          <Text className="font-sora text-gray-800 text-base leading-6 mb-6">
            {moment.content}
          </Text>

          {/* Tags */}
          {moment.tags.length > 0 && (
            <View className="mb-6">
              <Text className="font-sora-semibold text-gray-700 text-sm mb-3">
                Tags
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {moment.tags.map((tag: string, index: number) => (
                  <View
                    key={index}
                    className="bg-gray-100 rounded-full px-3 py-1"
                  >
                    <Text className="font-sora text-gray-600 text-sm">
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Mood */}
          {moment.mood && (
            <View className="mb-6">
              <Text className="font-sora-semibold text-gray-700 text-sm mb-3">
                Mood
              </Text>
              <View className="flex-row items-center">
                <Text className="text-2xl mr-2">
                  {getMoodEmoji(moment.mood)}
                </Text>
                <Text className="font-sora text-gray-600 text-base capitalize">
                  {moment.mood}
                </Text>
              </View>
            </View>
          )}

          {/* Date */}
          <View className="mb-6">
            <Text className="font-sora text-gray-600 text-sm">
              {formatDateAndTime(moment.createdAt)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
