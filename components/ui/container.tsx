import { SafeAreaView, View } from "react-native";

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView className="m-4 flex flex-1">{children}</SafeAreaView>
    </View>
  );
};
