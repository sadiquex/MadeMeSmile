import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CustomInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  showPasswordToggle?: boolean;
}

export default function CustomInput({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
  returnKeyType = "default",
  onSubmitEditing,
  autoCapitalize = "none",
  showPasswordToggle = false,
}: CustomInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleTogglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getSecureTextEntry = () => {
    if (showPasswordToggle) {
      return !isPasswordVisible;
    }
    return secureTextEntry;
  };

  return (
    <View className="flex gap-2">
      <Text className="text-gray-700 font-sora-medium">{label}</Text>
      <View className="relative">
        <TextInput
          className={`border rounded-lg px-4 py-3 text-gray-900 font-sora ${
            showPasswordToggle ? "pr-12" : ""
          } ${isFocused ? "border-red-500 border-2" : "border-gray-300"}`}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={getSecureTextEntry()}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {showPasswordToggle && (
          <TouchableOpacity
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
            onPress={handleTogglePassword}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
