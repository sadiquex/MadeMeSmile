import CustomButton from "@/components/ui/custom-button";
import CustomInput from "@/components/ui/custom-input";
import { CameraSmile01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // TODO: Implement actual login logic
    console.log("Login attempt:", { email, password });

    // For now, navigate to main app
    router.replace("/(tabs)");
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

              <CustomButton title="Sign In" onPress={handleLogin} />

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
