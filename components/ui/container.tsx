import { ScrollView, View } from "react-native";

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="mx-4 pt-2 flex flex-1"
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </View>
  );
};
