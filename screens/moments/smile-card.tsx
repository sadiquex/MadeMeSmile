import VideoPlayer from "@/components/ui/video-player";
import { getCategoryColor, getCategoryIcon } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 mb-4"
      onPress={handlePress}
      activeOpacity={0.9}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      {/* Media Section */}
      <View className="relative">
        {moment.mediaUrl && moment.mediaType === "photo" ? (
          <Image
            source={{ uri: moment.mediaUrl }}
            className="w-full h-[280px]"
            resizeMode="cover"
          />
        ) : moment.mediaUrl && moment.mediaType === "video" ? (
          <VideoPlayer
            uri={moment.mediaUrl}
            width="100%"
            height={280}
            showControls={false}
            autoPlay={false}
            loop={false}
            muted={true}
          />
        ) : (
          <View className="w-full h-[280px] bg-gradient-to-br from-gray-50 to-gray-100 items-center justify-center">
            <View className="bg-white/80 rounded-full p-6 shadow-sm">
              <Ionicons
                name={
                  moment.mediaType === "video"
                    ? "videocam"
                    : moment.mediaType === "audio"
                    ? "mic"
                    : "document-text"
                }
                size={32}
                color="#6B7280"
              />
            </View>
          </View>
        )}

        {/* Category Badge - Top Left */}
        <View className="absolute top-4 left-4">
          <View
            className={`${getCategoryColor(
              moment.category
            )} rounded-2xl px-3 py-1.5 flex-row items-center shadow-sm`}
          >
            <Ionicons
              name={getCategoryIcon(moment.category) as any}
              size={14}
              color="white"
            />
            <Text className="font-sora-medium text-white text-xs ml-2">
              {moment.category.charAt(0).toUpperCase() +
                moment.category.slice(1)}
            </Text>
          </View>
        </View>

        {/* Media Type Indicator - Top Right */}
        <View className="absolute top-4 right-4">
          <View className="bg-black/20 backdrop-blur-sm rounded-full p-2">
            <Ionicons
              name={
                moment.mediaType === "video"
                  ? "play-circle"
                  : moment.mediaType === "audio"
                  ? "volume-high"
                  : "image"
              }
              size={16}
              color="white"
            />
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View className="p-6">
        {/* Message */}
        <Text className="font-sora text-gray-800 text-base leading-6 mb-4">
          {moment.content.length > 70
            ? moment.content.slice(0, 70) + "..."
            : moment.content}
        </Text>

        {/* Tags */}
        {moment.tags.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mb-4">
            {moment.tags.slice(0, 4).map((tag: string, index: number) => (
              <View
                key={index}
                className="bg-gray-100 rounded-full px-3 py-1.5"
              >
                <Text className="font-sora text-gray-600 text-xs">#{tag}</Text>
              </View>
            ))}
            {moment.tags.length > 4 && (
              <View className="bg-gray-100 rounded-full px-3 py-1.5">
                <Text className="font-sora text-gray-600 text-xs">
                  +{moment.tags.length - 4} more
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Bottom Section */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#9CA3AF" />
            <Text className="font-sora text-gray-500 text-sm ml-2">
              {new Date(moment.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="heart-outline" size={16} color="#9CA3AF" />
            <Text className="font-sora text-gray-500 text-sm ml-1">
              {moment.likes || 0}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
