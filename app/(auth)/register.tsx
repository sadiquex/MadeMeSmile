import CustomButton from "@/components/ui/custom-button";
import CustomInput from "@/components/ui/custom-input";
import { useAuth } from "@/contexts/AuthContext";
import { registerUser, storeUserData } from "@/services/auth/auth.service";
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

import { registerFormSchema } from "@/services/auth/auth.schema";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { refreshAuthState } = useAuth();

  const handleRegister = async () => {
    const result = registerFormSchema.safeParse({
      displayName: name,
      email,
      password,
      confirmPassword,
    });
    if (!result.success) {
      const firstError = result.error.issues[0]?.message ?? "Invalid input";
      Toast.show({
        type: "error",
        text1: "Error",
        text2: firstError,
      });
      return;
    }

    const payload = result.data;
    setLoading(true);
    try {
      const response = await registerUser({
        email: payload.email,
        password: payload.password,
        displayName: payload.displayName,
      });
      console.log(
        "🚀 ~ handleRegister ~ response:",
        JSON.stringify(response, null, 2),
      );

      if (response.success && response.data) {
        const token =
          (response.data as { accessToken?: string; token?: string })
            .accessToken ??
          (response.data as { accessToken?: string; token?: string }).token;
        if (token) {
          await storeUserData(response.data.user, token);
          await refreshAuthState();
        }
        router.replace("/(tabs)");
      } else {
        Toast.show({
          type: "error",
          text1: response.message,
        });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: error?.message ?? "Please try again.",
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
                Join MadeMeSmile
              </Text>
              <Text className="text-gray-600 font-sora">
                Create an account to start spreading joy
              </Text>
            </View>

            <View className="flex gap-4">
              <CustomInput
                label="Full Name"
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
              />

              <CustomInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />

              <CustomInput
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="next"
              />

              <CustomInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />

              <CustomButton
                title={loading ? "Creating Account..." : "Create Account"}
                onPress={handleRegister}
              />
            </View>
          </View>

          <View className="py-6">
            <Text className="text-gray-600 text-center">
              Already have an account?{" "}
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
