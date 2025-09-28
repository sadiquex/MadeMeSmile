import BottomModal from "@/components/ui/bottom-modal";
import SaveToCollectionModal from "@/screens/add-moment/save-to-collection-modal";
import React, { useState } from "react";
import { Share, Text, TouchableOpacity, View } from "react-native";

interface MomentActionsModalProps {
  isVisible?: boolean;
  onClose?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSaveToGallery?: () => void;
  onShare?: () => void;
  onAddToCollection?: () => void;
  hasMedia?: boolean;
}

export default function MomentActionsModal({
  isVisible,
  onClose,
  onEdit,
  onDelete,
  onSaveToGallery,
  onShare,
  onAddToCollection,
  hasMedia = false,
}: MomentActionsModalProps) {
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>("");

  const handleCollectionSelect = (collection: string) => {
    setSelectedCollection(collection);
  };
  return (
    <>
      <BottomModal
        isVisible={isVisible}
        onClose={onClose}
        // title="Moment Actions"
        snapPoints={["30%"]}
      >
        <View className="flex-1">
          <View className="space-y-2 items-center gap-4 mt-2">
            <TouchableOpacity
              onPress={() => {
                setShowCollectionModal(true);
              }}
            >
              <Text className="font-sora-medium text-gray-800 text-base">
                Add to Collection
              </Text>
            </TouchableOpacity>

            <Text className="font-sora-medium text-gray-800 text-base">
              Save to Gallery
            </Text>

            {/* share moment */}
            <TouchableOpacity
              onPress={() => {
                // share popup
                Share.share({
                  message: "Check out this moment!",
                  url: "https://www.github.com/sadiquex",
                });
              }}
            >
              <Text className="font-sora-medium text-gray-800 text-base">
                Share...
              </Text>
            </TouchableOpacity>

            <Text className="font-sora-medium text-gray-800 text-base">
              Edit Moment
            </Text>
            <Text className="font-sora-medium text-red-600 text-base">
              Delete Moment
            </Text>
          </View>
        </View>
      </BottomModal>

      {/* collection modal */}
      <SaveToCollectionModal
        isVisible={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
        onSelectCollection={handleCollectionSelect}
        selectedCollection={selectedCollection}
        isDetailsScreen={true}
      />
    </>
  );
}
