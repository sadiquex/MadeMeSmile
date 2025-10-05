import { auth, db } from "@/firebase-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const TOKEN_STORAGE_KEY = "@mademesmile_tokens";
const USER_STORAGE_KEY = "@mademesmile_user";
const ONBOARDING_STORAGE_KEY = "@mademesmile_onboarding_completed";

export async function signUp(
  email: string,
  password: string,
  displayName: string
) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // Update the user's display name
  await updateProfile(user, {
    displayName: displayName,
  });

  // Create Firestore profile
  await setDoc(doc(db, "users", user.uid), {
    displayName,
    email: user.email,
    photoURL: null,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  });

  // Store user data and tokens
  await storeUserData(user);

  return user;
}

export async function signIn(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // Store user data and tokens
  await storeUserData(user);

  return user;
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

// Store user data and tokens in AsyncStorage
export async function storeUserData(user: any) {
  try {
    const userDataToStore = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      lastSignInTime: user.metadata.lastSignInTime,
      creationTime: user.metadata.creationTime,
    };

    await AsyncStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify(userDataToStore)
    );

    // Store the Firebase ID token
    const idToken = await user.getIdToken();
    const refreshToken = user.refreshToken;

    await AsyncStorage.setItem(
      TOKEN_STORAGE_KEY,
      JSON.stringify({
        idToken,
        refreshToken,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error("Error storing user data:", error);
  }
}

// Retrieve user data from AsyncStorage
export async function retrieveUserData(): Promise<any | null> {
  try {
    const storedUserData = await AsyncStorage.getItem(USER_STORAGE_KEY);
    const storedTokens = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);

    if (!storedUserData || !storedTokens) {
      return null;
    }

    const userData = JSON.parse(storedUserData);
    const tokens = JSON.parse(storedTokens);

    // Check if tokens are still valid (Firebase tokens expire after 1 hour)
    const tokenAge = Date.now() - tokens.timestamp;
    const TOKEN_EXPIRY_TIME = 50 * 60 * 1000; // 50 minutes in milliseconds

    if (tokenAge > TOKEN_EXPIRY_TIME) {
      // Tokens are expired, clear storage
      await clearStoredData();
      return null;
    }

    return userData;
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return null;
  }
}

// Clear stored user data and tokens
export async function clearStoredData() {
  try {
    await AsyncStorage.multiRemove([USER_STORAGE_KEY, TOKEN_STORAGE_KEY]);
    // Note: We don't clear onboarding status here so users don't see onboarding again after logout
    // If you want users to see onboarding again after logout, uncomment the line below:
    // await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing stored data:", error);
  }
}

// Check if user is authenticated based on stored data
export async function isUserAuthenticated(): Promise<boolean> {
  try {
    const storedUser = await retrieveUserData();
    return storedUser !== null;
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return false;
  }
}

// Mark onboarding as completed
export async function markOnboardingCompleted(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
  } catch (error) {
    console.error("Error marking onboarding as completed:", error);
  }
}

// Check if onboarding has been completed
export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const onboardingStatus = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
    return onboardingStatus === "true";
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
}

// Reset onboarding status (useful for testing or if user wants to see onboarding again)
export async function resetOnboardingStatus(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch (error) {
    console.error("Error resetting onboarding status:", error);
  }
}
