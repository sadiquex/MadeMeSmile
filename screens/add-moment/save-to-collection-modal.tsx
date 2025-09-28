import BottomModal from "@/components/ui/bottom-modal";
import { COLLECTION_OPTIONS } from "@/types";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface SaveToCollectionModalProps {
  isVisible?: boolean;
  onClose?: () => void;
  onSelectCollection?: (collection: string) => void;
  selectedCollection?: string;
}

export default function SaveToCollectionModal({
  isVisible,
  onClose,
  onSelectCollection,
  selectedCollection,
}: SaveToCollectionModalProps) {
  const [localSelectedCollection, setLocalSelectedCollection] = useState(
    selectedCollection || ""
  );

  const handleSelectCollection = (collectionValue: string) => {
    setLocalSelectedCollection(collectionValue);
    onSelectCollection?.(collectionValue);
  };

  return (
    <BottomModal
      isVisible={isVisible}
      onClose={onClose}
      title="Add to Collection"
      snapPoints={["30%"]}
    >
      <View className="flex-1">
        {/* horizontal scroll */}
        <ScrollView
          className="flex-1"
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{ paddingHorizontal: 4 }}
        >
          <View className="flex-row gap-3">
            {COLLECTION_OPTIONS.map((collection) => (
              <TouchableOpacity
                key={collection.value}
                onPress={() => handleSelectCollection(collection.value)}
                className={`items-center rounded-xl border-2 p-4 w-[100px] min-h-[120px] justify-center ${
                  localSelectedCollection === collection.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <Text className="text-3xl mb-2">{collection.icon}</Text>
                <Text className="font-sora-semibold text-gray-900 text-sm text-center">
                  {collection.label}
                </Text>
                {localSelectedCollection === collection.value && (
                  <View className="absolute top-2 right-2 h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                    <Text className="text-white text-xs">✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </BottomModal>
  );
}
