import CustomButton from "@/components/ui/custom-button";
import CustomInput from "@/components/ui/custom-input";
import { signUp } from "@/services/auth/auth.service";
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

import { isValidEmail } from "@/lib/utils";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Input validation
    if (!name || !email || !password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
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

    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Password must be at least 6 characters long",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Passwords do not match",
      });
      return;
    }

    setLoading(true);
    try {
      const user = await signUp(email.trim(), password, name.trim());

      console.log("Registration successful:", user);

      // Show success message
      Toast.show({
        type: "success",
        text1: "Welcome to MadeMeSmile!",
        text2: "Your account has been created successfully.",
        onPress: () => router.replace("/(tabs)"),
      });

      // Navigate after a short delay
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 1500);
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "Registration failed. Please try again.";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage =
            "An account with this email already exists. Please sign in instead.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address format.";
          break;
        case "auth/weak-password":
          errorMessage =
            "Password is too weak. Please choose a stronger password.";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection.";
          break;
        case "auth/operation-not-allowed":
          errorMessage =
            "Email/password sign-up is not enabled. Please contact support.";
          break;
        case "permission-denied":
          errorMessage = "Permission denied. Please contact support.";
          break;
        default:
          errorMessage = `Registration failed: ${error.message}`;
      }

      Toast.show({
        type: "error",
        text1: "Registration Failed",
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
