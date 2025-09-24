import React, { useRef, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ScrollView } from "react-native-gesture-handler";
import BottomModal from "./bottom-modal";

export interface CustomDropdownProps {
  label?: string;
  placeholder?: string;
  options?: any[];
  onChangeValue?: (value: any) => void;
  className?: string;
}

const CustomDropdown = ({
  label,
  placeholder,
  options,
  onChangeValue,
  className,
}: CustomDropdownProps) => {
  const [value, setValue] = useState<any>(null);
  const bottomSheetModalRef = useRef<any>(null);

  const handleOpenModal = () => {
    bottomSheetModalRef.current?.present();
  };

  const onPressOption = (option: any) => {
    setValue(option.value);
    onChangeValue?.(option.value);
    bottomSheetModalRef.current?.close();
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleOpenModal}
        className={`${className} flex-row gap-[12px] rounded-[7px] border-[1px] border-[#D0D5DD] px-[12px] py-[8px]`}
      >
        <View className="flex-1 flex-col">
          {label && <Text className="mb-[4px]">{label}</Text>}
          <View className="flex-1 justify-center">
            <Text
              className={`font-sora ${
                value ? "text-[#111827]" : "text-[#98A2B3]"
              }`}
            >
              {value
                ? options?.find((option: any) => option.value === value)?.label
                : placeholder}
            </Text>
          </View>
        </View>
        <View className="justify-end">
          <Ionicons name="chevron-down" size={24} color="#000" />
        </View>
      </TouchableOpacity>
      <BottomModal bottomSheetModalRef={bottomSheetModalRef}>
        <View className="mb-[16px] w-full">
          <Text className="mb-[5px]">{label}</Text>
          <Text className="mb-[8px] text-[#718096]">Select an option</Text>
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {options?.map((option: any) => (
              <TouchableOpacity
                onPress={() => onPressOption(option)}
                className="flex-row items-center border-b-[1px] border-b-[#0000001F] py-[24px]"
                key={option.value}
              >
                {option.icon}
                <Text>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </BottomModal>
    </>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    height: Dimensions.get("window").height * 0.85,
  },
  scrollViewContent: {
    height: "250%",
  },
});
