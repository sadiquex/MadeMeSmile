import VideoPlayer from "@/components/ui/video-player";
import {
  formatDateAndTime,
  getCategoryColor,
  getCategoryIcon,
} from "@/lib/utils";
import { IMoment } from "@/services/moments/moments.types";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v"];
const AUDIO_EXTENSIONS = [".mp3", ".wav", ".m4a", ".aac"];

function inferMediaType(mediaUrl: string): "photo" | "video" | "audio" {
  const lower = mediaUrl.toLowerCase();
  if (VIDEO_EXTENSIONS.some((ext) => lower.includes(ext))) return "video";
  if (AUDIO_EXTENSIONS.some((ext) => lower.includes(ext))) return "audio";
  return "photo";
}

interface SmileCardProps {
  moment: IMoment;
}

export default function SmileCard({ moment }: SmileCardProps) {
  const router = useRouter();
  const mediaType = moment.mediaUrl ? inferMediaType(moment.mediaUrl) : "photo";

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/moment/${moment.id}`);
  };

  const categoryKey = (moment.collection || moment.feeling || "random")
    .toLowerCase()
    .replace(/\s+/g, "-");

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
        {moment.mediaUrl && mediaType === "photo" ? (
          <Image
            source={{ uri: moment.mediaUrl }}
            className="w-full h-[280px]"
            resizeMode="cover"
          />
        ) : moment.mediaUrl && mediaType === "video" ? (
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
                  mediaType === "video"
                    ? "videocam"
                    : mediaType === "audio"
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
            className={`${getCategoryColor(categoryKey)} rounded-2xl px-3 py-1.5 flex-row items-center shadow-sm`}
          >
            <Ionicons
              name={getCategoryIcon(categoryKey) as any}
              size={14}
              color="white"
            />
            <Text className="font-sora-medium text-white text-xs ml-2">
              {(moment.collection || moment.feeling || "Moment")
                .charAt(0)
                .toUpperCase() +
                (moment.collection || moment.feeling || "Moment").slice(1)}
            </Text>
          </View>
        </View>

        {/* Media Type Indicator - Top Right */}
        <View className="absolute top-4 right-4">
          <View className="bg-black/20 backdrop-blur-sm rounded-full p-2">
            <Ionicons
              name={
                mediaType === "video"
                  ? "play-circle"
                  : mediaType === "audio"
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
        {/* Description */}
        {moment.description && (
          <Text className="font-sora text-gray-800 text-base leading-6 mb-4">
            {moment.description.length > 70
              ? moment.description.slice(0, 70) + "..."
              : moment.description}
          </Text>
        )}

        {/* Feeling badge */}
        {moment.feeling && (
          <View className="flex-row flex-wrap gap-2 mb-4">
            <View className="bg-gray-100 rounded-full px-3 py-1.5">
              <Text className="font-sora text-gray-600 text-xs capitalize">
                {moment.feeling}
              </Text>
            </View>
          </View>
        )}

        {/* Bottom Section */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#9CA3AF" />
            <Text className="font-sora text-gray-500 text-sm ml-2">
              {formatDateAndTime(new Date(moment.createdAt))}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
