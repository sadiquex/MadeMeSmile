import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface CustomButtonProps {
  title: string | React.ReactNode;
  onPress: () => void;
  className?: string;
  textClassName?: string;
  variant?: "primary" | "outlined" | "disabled";
}

export default function CustomButton({
  title,
  onPress,
  className,
  textClassName,
  variant = "primary",
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      className={`rounded-lg py-4 text-center items-center justify-center ${className}`}
      onPress={onPress}
      style={{
        backgroundColor: variant === "primary" ? "#f87171" : "#fff",
      }}
    >
      <Text className={`text-white font-sora-bold ${textClassName}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
