import CustomButton from "@/components/ui/custom-button";
import CustomInput from "@/components/ui/custom-input";
import { resetPassword } from "@/services/auth/auth.service";
import { CameraSmile01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

// Email validation helper
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter your email address",
      });
      return;
    }

    if (!isValidEmail(email)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a valid email address",
      });
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim());

      Toast.show({
        type: "success",
        text1: "Reset Link Sent",
        text2: "We've sent a password reset link to your email address.",
        onPress: () => router.push("/(auth)/login"),
      });

      // Navigate after a short delay
      setTimeout(() => {
        router.push("/(auth)/login");
      }, 1500);
    } catch (error: any) {
      console.error("Password reset error:", error);
      const errorMessage =
        error?.message || "Failed to send reset email. Please try again.";
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 bg-white px-6">
          <View className="flex-1 justify-center">
            <View className="mb-8 flex flex-col gap-2">
              <HugeiconsIcon
                icon={CameraSmile01Icon}
                size={60}
                color="#f87171"
              />

              <Text className="text-3xl font-sora-bold text-gray-900">
                Reset Password
              </Text>
              <Text className="text-gray-600 font-sora">
                Enter your email address and we'll send you a link to reset your
                password
              </Text>
            </View>

            <View className="flex gap-4">
              <CustomInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleResetPassword}
              />

              <CustomButton
                title={loading ? "Sending..." : "Send Reset Link"}
                onPress={handleResetPassword}
              />
            </View>
          </View>

          <View className="py-6">
            <Text className="text-gray-600 text-center">
              Remember your password?{" "}
              <Text
                className="text-primary font-semibold"
                onPress={() => router.push("/(auth)/login")}
              >
                Sign In
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
