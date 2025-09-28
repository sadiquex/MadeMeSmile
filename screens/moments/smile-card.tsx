import {
  getCategoryColor,
  getCategoryGradientColors,
  getCategoryIcon,
} from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Moment } from "../../types";

interface SmileCardProps {
  moment: Moment;
}

export default function SmileCard({ moment }: SmileCardProps) {
  const router = useRouter();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/moment/${moment.id}`);
    console.log("handlePress");
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200"
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Image Section */}
      <View className="relative">
        {moment.mediaUrl && moment.mediaType === "photo" ? (
          <Image
            source={{ uri: moment.mediaUrl }}
            className="w-full h-[350px]"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-[350px] bg-gray-100 items-center justify-center">
            <Ionicons
              name={
                moment.mediaType === "video"
                  ? "videocam"
                  : moment.mediaType === "audio"
                  ? "mic"
                  : "document-text"
              }
              size={48}
              color="#9CA3AF"
            />
          </View>
        )}

        {/* Gradient Overlay */}
        <LinearGradient
          colors={getCategoryGradientColors(moment.category)}
          // locations={[0, 0.5, 1]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,

            bottom: 0,
            height: 200,
          }}
        />

        {/* Content Overlay */}
        <View className="absolute bottom-0 left-0 right-0 p-4">
          {/* Message */}
          <Text className="font-sora text-white text-sm mb-3 drop-shadow-lg">
            {moment.content.length > 70
              ? moment.content.slice(0, 70) + "..."
              : moment.content}
          </Text>

          {/* Tags */}
          {moment.tags.length > 0 && (
            <View className="flex-row flex-wrap gap-2">
              {moment.tags.slice(0, 3).map((tag: string, index: number) => (
                <View
                  key={index}
                  className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"
                >
                  <Text className="font-sora text-white text-xs">#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Category Badge - Top Right */}
        <View className="absolute top-3 right-3">
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
    </TouchableOpacity>
  );
}
