import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

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
    <View className="flex-1 bg-white px-6">
      <View className="flex-1 justify-center">
        <View className="mb-8">
          <Text className="text-3xl font-sora-bold text-gray-900 mb-2">
            Welcome Back
          </Text>
          <Text className="text-gray-600 font-sora">
            Sign in to continue spreading joy
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 font-sora-medium mb-2">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-sora"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-sora-medium mb-2">
              Password
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-sora"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            className="bg-blue-500 rounded-lg py-4 mt-6"
            onPress={handleLogin}
          >
            <Text className="text-white text-center font-sora-bold text-lg">
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-4"
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            <Text className="text-blue-500 text-center">Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="py-6">
        <Text className="text-gray-600 text-center">
          Don't have an account?{" "}
          <Text
            className="text-blue-500 font-semibold"
            onPress={() => router.push("/(auth)/register")}
          >
            Sign Up
          </Text>
        </Text>
      </View>
    </View>
  );
}
