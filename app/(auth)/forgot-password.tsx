import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    // TODO: Implement actual password reset logic
    console.log("Password reset request for:", email);

    Alert.alert(
      "Reset Link Sent",
      "We've sent a password reset link to your email address.",
      [
        {
          text: "OK",
          onPress: () => router.push("/(auth)/login"),
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white px-6">
      <View className="flex-1 justify-center">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Reset Password
          </Text>
          <Text className="text-gray-600">
            Enter your email address and we'll send you a link to reset your
            password
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 font-medium mb-2">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            className="bg-blue-500 rounded-lg py-4 mt-6"
            onPress={handleResetPassword}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Send Reset Link
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="py-6">
        <Text className="text-gray-600 text-center">
          Remember your password?{" "}
          <Text
            className="text-blue-500 font-semibold"
            onPress={() => router.push("/(auth)/login")}
          >
            Sign In
          </Text>
        </Text>
      </View>
    </View>
  );
}
