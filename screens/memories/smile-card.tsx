import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Moment } from "../../types";

interface SmileCardProps {
  moment: Moment;
  size?: "small" | "medium" | "large";
  onPress?: () => void;
}

export default function SmileCard({
  moment,
  size = "medium",
  onPress,
}: SmileCardProps) {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "h-24";
      case "large":
        return "h-48";
      default:
        return "h-32";
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "small":
        return "text-xs";
      case "large":
        return "text-base";
      default:
        return "text-sm";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "family":
        return "bg-red-100";
      case "friends":
        return "bg-green-100";
      case "work":
        return "bg-blue-100";
      default:
        return "bg-yellow-100";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "family":
        return "heart";
      case "friends":
        return "people";
      case "work":
        return "briefcase";
      default:
        return "star";
    }
  };

  return (
    <TouchableOpacity
      className={`${getSizeClasses()} rounded-2xl overflow-hidden shadow-sm`}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Background with gradient based on category */}
      <View className={`${getCategoryColor(moment.category)} flex-1 p-3`}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <View className="w-6 h-6 bg-white rounded-full items-center justify-center mr-2">
              <Ionicons
                name={getCategoryIcon(moment.category) as any}
                size={12}
                color="#6B7280"
              />
            </View>
            <Text className="font-sora-medium text-gray-700 text-xs">
              {moment.category.charAt(0).toUpperCase() +
                moment.category.slice(1)}
            </Text>
          </View>
          {moment.mediaType !== "text" && (
            <Ionicons
              name={
                moment.mediaType === "photo"
                  ? "image"
                  : moment.mediaType === "video"
                  ? "videocam"
                  : "mic"
              }
              size={14}
              color="#6B7280"
            />
          )}
        </View>

        {/* Content */}
        <View className="flex-1">
          {moment.mediaUrl && moment.mediaType === "photo" ? (
            <View className="flex-1">
              <Image
                source={{ uri: moment.mediaUrl }}
                className="flex-1 rounded-lg"
                resizeMode="cover"
              />
              <View className="absolute bottom-1 left-1 right-1">
                <Text
                  className={`font-sora text-white ${getTextSize()} leading-tight`}
                  numberOfLines={size === "small" ? 1 : 2}
                  style={{
                    textShadowColor: "rgba(0,0,0,0.5)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 2,
                  }}
                >
                  {moment.content}
                </Text>
              </View>
            </View>
          ) : (
            <View className="flex-1 justify-between">
              <Text
                className={`font-sora text-gray-800 ${getTextSize()} leading-tight`}
                numberOfLines={size === "small" ? 2 : size === "large" ? 4 : 3}
              >
                {moment.content}
              </Text>

              {/* Tags */}
              {moment.tags.length > 0 && size !== "small" && (
                <View className="flex-row flex-wrap gap-1 mt-2">
                  {moment.tags.slice(0, 2).map((tag: string, index: number) => (
                    <View
                      key={index}
                      className="bg-white/80 rounded-full px-2 py-1"
                    >
                      <Text className="font-sora text-gray-600 text-xs">
                        #{tag}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

        {/* Date */}
        <Text className="font-sora text-gray-500 text-xs mt-1">
          {new Date(moment.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
