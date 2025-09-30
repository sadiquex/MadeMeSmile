import CustomButton from "@/components/ui/custom-button";
import CustomInput from "@/components/ui/custom-input";
import { signIn } from "@/services/auth/auth.service";
import {
  AppleIcon,
  CameraSmile01Icon,
  FacebookIcon,
  GoogleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { isValidEmail } from "@/lib/utils";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Input validation
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "All fields are required",
      });
      return;
    }

    if (!isValidEmail(email)) {
      Toast.show({
        type: "error",
        text1: "Invalid email address",
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Password must be at least 6 characters long",
      });
      return;
    }

    setLoading(true);
    try {
      const user = await signIn(email.trim(), password);

      console.log("Login successful:", user);

      // Show success message
      Toast.show({
        type: "success",
        text1: "Welcome back!",
        onPress: () => router.replace("/(tabs)"),
      });

      // Navigate after a short delay
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 1500);
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Login failed. Please try again.";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage =
            "No account found with this email address. Please check your email or sign up for a new account.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address format.";
          break;
        case "auth/user-disabled":
          errorMessage =
            "This account has been disabled. Please contact support.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection.";
          break;
        case "auth/invalid-credential":
          errorMessage =
            "Invalid email or password. Please check your credentials.";
          break;
        case "auth/operation-not-allowed":
          errorMessage =
            "Email/password sign-in is not enabled. Please contact support.";
          break;
        default:
          errorMessage = `Login failed: ${error.message}`;
      }

      Toast.show({
        type: "error",
        text1: "Login Failed",
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
                Welcome Back
              </Text>
              <Text className="text-gray-600 font-sora">
                Sign in to continue spreading joy
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
                returnKeyType="next"
              />

              <CustomInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />

              <CustomButton
                title={
                  loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    "Sign In"
                  )
                }
                onPress={handleLogin}
              />

              <View className="flex-row items-center gap-2">
                <View className="h-[1px] bg-gray-200 flex-1" />
                <Text className="text-gray-600 text-center font-sora text-xs">
                  Or continue with
                </Text>
                <View className="h-[1px] bg-gray-200 flex-1" />
              </View>

              {/* or continue with google or apple */}
              <View className="flex-row justify-between gap-2">
                <TouchableOpacity className="flex-1 bg-white rounded-lg p-2 border border-gray-200 items-center">
                  <HugeiconsIcon icon={GoogleIcon} size={24} color="#f87171" />
                </TouchableOpacity>

                <TouchableOpacity className="flex-1 bg-white rounded-lg p-2 border border-gray-200 items-center">
                  <HugeiconsIcon icon={AppleIcon} size={24} color="#f87171" />
                </TouchableOpacity>

                <TouchableOpacity className="flex-1 bg-white rounded-lg p-2 border border-gray-200 items-center">
                  <HugeiconsIcon
                    icon={FacebookIcon}
                    size={24}
                    color="#f87171"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => router.push("/(auth)/forgot-password")}
              >
                <Text className="text-primary text-center">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="py-6">
            <Text className="text-gray-600 text-center">
              Don&apos;t have an account?{" "}
              <Text
                className="text-primary font-semibold"
                onPress={() => router.push("/(auth)/register")}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
