import React from "react";
import { Text, View } from "react-native";

export default function ScreenHeader({ title }: { title: string }) {
  return (
    <View className="bg-blue-200">
      <View className="p-4 pt-16">
        <Text className="text-2xl font-sora-medium text-gray-900">{title}</Text>
      </View>
    </View>
  );
}
