import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React from "react";
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export default function ScreenHeader({
  title,
  showBackButton,
  showRightButton,
  rightButtonOnPress,
}: {
  title: string;
  showBackButton?: boolean;
  showRightButton?: boolean;
  rightButtonOnPress?: () => void;
}) {
  return (
    <BlurView
      intensity={80}
      tint="light"
      className="absolute top-0 left-0 right-0 z-50"
    >
      <View className="p-4 pt-16 flex-row items-center justify-between">
        {showBackButton && (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
        )}
        <Text className="text-xl font-sora-medium text-gray-900">{title}</Text>
        {showRightButton && (
          <TouchableOpacity onPress={rightButtonOnPress}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#374151" />
          </TouchableOpacity>
        )}
      </View>
    </BlurView>
  );
}

export const HeaderHeightSpace = ({
  className,
  style,
}: {
  className?: string;
  style?: StyleProp<ViewStyle>;
}) => {
  return <View className={`h-[60px] ${className}`} style={style} />;
};
