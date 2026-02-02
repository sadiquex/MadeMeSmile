import AsyncStorage from "@react-native-async-storage/async-storage";

export const TOKEN_STORAGE_KEY = "@mademesmile_token";

/**
 * Returns the current access token for API requests.
 * Used by the API client interceptor – kept separate to avoid circular deps.
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}
