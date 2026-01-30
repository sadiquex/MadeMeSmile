import api from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  LoginUserPayload,
  LoginUserResponse,
  RegisterUserPayload,
  RegisterUserResponse,
} from "./auth.types";

const USER_STORAGE_KEY = "@mademesmile_user";
const TOKEN_STORAGE_KEY = "@mademesmile_token";
const ONBOARDING_STORAGE_KEY = "@mademesmile_onboarding_completed";

/** Stored user shape – matches API user from login/register */
export interface StoredUser {
  id: string;
  email: string;
  displayName: string;
  photoUrl: string | null;
  provider: string;
  onboarded: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

const NOT_IMPLEMENTED =
  "Auth not configured. Integrate REST API in services/auth/auth.service.ts";

export async function registerUser(
  data: RegisterUserPayload,
): Promise<RegisterUserResponse> {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

export async function loginUser(
  data: LoginUserPayload,
): Promise<LoginUserResponse> {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
}

export async function resetPassword(email: string): Promise<void> {
  throw new Error(NOT_IMPLEMENTED);
}

export async function storeUserData(
  user: StoredUser,
  accessToken: string,
): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  } catch (error) {
    console.error("Error storing user data:", error);
  }
}

export async function retrieveUserData(): Promise<StoredUser | null> {
  try {
    const raw = await AsyncStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredUser;
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return null;
  }
}

export async function clearStoredData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([USER_STORAGE_KEY, TOKEN_STORAGE_KEY]);
  } catch (error) {
    console.error("Error clearing stored data:", error);
  }
}

export async function markOnboardingCompleted(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
  } catch (error) {
    console.error("Error marking onboarding as completed:", error);
  }
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const status = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
    return status === "true";
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
}

export async function resetOnboardingStatus(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch (error) {
    console.error("Error resetting onboarding status:", error);
  }
}
