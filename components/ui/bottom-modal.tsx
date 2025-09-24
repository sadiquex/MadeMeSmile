import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BottomModalProps {
  children: React.ReactNode;
  bottomSheetModalRef?: React.RefObject<BottomSheetModal>;
  isVisible?: boolean;
  onClose?: () => void;
  snapPoints?: string[];
  enablePanDownToClose?: boolean;
  showCloseButton?: boolean;
  title?: string;
}

const BottomModal = ({
  children,
  bottomSheetModalRef,
  isVisible,
  onClose,
  snapPoints = ["50%", "75%", "100%"],
  enablePanDownToClose = true,
  showCloseButton = true,
  title,
}: BottomModalProps) => {
  const internalRef = useRef<BottomSheetModal>(null);
  const modalRef = bottomSheetModalRef || internalRef;

  // Handle controlled visibility
  useEffect(() => {
    if (isVisible !== undefined) {
      if (isVisible) {
        modalRef.current?.present();
      } else {
        modalRef.current?.close();
      }
    }
  }, [isVisible, modalRef]);

  const closeModal = React.useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      modalRef.current?.close();
    }
  }, [onClose, modalRef]);

  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        onPress={closeModal}
        opacity={0.5}
      />
    ),
    [closeModal]
  );

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={snapPoints}
      index={0}
      handleStyle={styles.bottomSheetHandle}
      enablePanDownToClose={enablePanDownToClose}
      containerStyle={styles.containerStyle}
      handleIndicatorStyle={styles.handleIndicatorStyle}
      backdropComponent={renderBackdrop}
      onDismiss={onClose}
      enableDynamicSizing={false}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View className="mb-[16px] flex-row items-center justify-between">
          <View className="flex-1 bg-gray-200" />
          <View className="h-[5px] w-[53px] rounded-[8px] bg-[#A7A9AF]" />
          <View className="flex-1 flex-row items-center justify-end">
            {showCloseButton && (
              <TouchableOpacity
                className="h-[32px] w-[32px] items-center justify-center rounded-[32px] bg-[#EBEBEB]"
                onPress={closeModal}
              >
                <Text className="text-[#666] font-semibold">×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {title && (
          <View className="mb-4">
            <Text className="text-lg font-semibold text-center text-gray-800">
              {title}
            </Text>
          </View>
        )}

        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheetHandle: {
    backgroundColor: "transparent",
    padding: 0,
    marginTop: -24,
  },
  containerStyle: {
    zIndex: 1000,
  },
  contentContainer: {
    alignItems: "center",
    padding: 14,
    paddingBottom: 30,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 1000,
  },
  handleIndicatorStyle: {
    backgroundColor: "transparent",
  },
});

export default BottomModal;
export { BottomSheetModalProvider };
