import CustomButton from "@/components/ui/custom-button";
import CustomInput from "@/components/ui/custom-input";
import { useAuth } from "@/contexts/AuthContext";
import { loginUser, storeUserData } from "@/services/auth/auth.service";
import { CameraSmile01Icon } from "@hugeicons/core-free-icons";
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

import { loginFormSchema } from "@/services/auth/auth.schema";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { refreshAuthState } = useAuth();

  const handleLogin = async () => {
    const result = loginFormSchema.safeParse({ email, password });
    if (!result.success) {
      const firstError = result.error.issues[0]?.message ?? "Invalid input";
      Toast.show({
        type: "error",
        text1: firstError,
      });
      return;
    }

    const payload = result.data;
    setLoading(true);
    try {
      const response = await loginUser({
        email: payload.email,
        password: payload.password,
      });
      console.log(
        "🚀 ~ handleLogin ~ response:",
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
      console.error("Login error:", error);
      const errorMessage = error?.message || "Login failed. Please try again.";
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
                showPasswordToggle={true}
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

              {/* Social authentication buttons */}
              {/* <View className="flex-row justify-between gap-2">
                <TouchableOpacity
                  className="flex-1 bg-white rounded-lg p-2 border border-gray-200 items-center"
                  onPress={handleGoogleSignIn}
                  disabled={socialLoading.google}
                >
                  {socialLoading.google ? (
                    <ActivityIndicator size="small" color="#f87171" />
                  ) : (
                    <Image
                      source={require("@/assets/images/login/google-icon.png")}
                      className="w-6 h-6"
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 bg-white rounded-lg p-2 border border-gray-200 items-center"
                  onPress={handleAppleSignIn}
                  disabled={socialLoading.apple}
                >
                  {socialLoading.apple ? (
                    <ActivityIndicator size="small" color="#f87171" />
                  ) : (
                    <Image
                      source={require("@/assets/images/login/apple-icon.png")}
                      className="w-6 h-6"
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 bg-white rounded-lg p-2 border border-gray-200 items-center"
                  onPress={handleTwitterSignIn}
                  disabled={socialLoading.twitter}
                >
                  {socialLoading.twitter ? (
                    <ActivityIndicator size="small" color="#f87171" />
                  ) : (
                    <Image
                      source={require("@/assets/images/login/twitter-icon.png")}
                      className="w-6 h-6"
                    />
                  )}
                </TouchableOpacity>
              </View> */}

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
