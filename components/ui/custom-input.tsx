import React from "react";
import {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  Text,
  TextInput,
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
}: CustomInputProps) {
  return (
    <View className="flex gap-2">
      <Text className="text-gray-700 font-sora-medium">{label}</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-sora"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}
