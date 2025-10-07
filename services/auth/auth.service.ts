import { auth, db } from "@/firebase-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AppleAuthentication from "expo-apple-authentication";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// import * as AuthSession from "expo-auth-session";
// import * as WebBrowser from "expo-web-browser";
// import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
// import { auth, db } from "@/firebase-config";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { storeUserData } from "./auth";

// Configure WebBrowser for OAuth flows
WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID =
  "375112534665-b5qekn5fjrda33fbba6tsj4o69vprlss.apps.googleusercontent.com";

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

// export async function signInWithGoogle() {
//   try {
//     const redirectUri = AuthSession.makeRedirectUri({
//       // scheme: "mademesmile",
//       // path: "auth",
//       native: "mademesmile://auth", // for production builds
//     });
//     console.log("🚀 ~ signInWithGoogle ~ redirectUri:", redirectUri);

//     const authUrl =
//       "https://accounts.google.com/o/oauth2/v2/auth?" +
//       new URLSearchParams({
//         client_id: GOOGLE_CLIENT_ID,
//         redirect_uri: redirectUri,
//         response_type: "id_token",
//         scope: "openid email profile",
//       }).toString();

//     const result = await AuthSession.promptAsync({ authUrl });

//     if (result.type === "success" && result.params.id_token) {
//       const credential = GoogleAuthProvider.credential(result.params.id_token);
//       const userCredential = await signInWithCredential(auth, credential);
//       const user = userCredential.user;

//       const userDoc = await getDoc(doc(db, "users", user.uid));
//       if (!userDoc.exists()) {
//         await setDoc(doc(db, "users", user.uid), {
//           displayName: user.displayName,
//           email: user.email,
//           photoURL: user.photoURL,
//           createdAt: new Date().toISOString(),
//           lastLogin: new Date().toISOString(),
//           provider: "google",
//         });
//       } else {
//         await setDoc(
//           doc(db, "users", user.uid),
//           { lastLogin: new Date().toISOString() },
//           { merge: true }
//         );
//       }

//       await storeUserData(user);
//       return user;
//     } else {
//       throw new Error("Google Sign-In cancelled or failed");
//     }
//   } catch (error) {
//     console.error("Google Sign-In Error:", error);
//     throw error;
//   }
// }

// Google Sign-In using Expo AuthSession
export async function signInWithGoogle() {
  try {
    // Create a redirect URI
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: "mademesmile",
      path: "auth",
    });

    // Create the auth request
    const request = new AuthSession.AuthRequest({
      clientId: GOOGLE_CLIENT_ID,
      scopes: ["openid", "profile", "email"],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {
        access_type: "offline",
      },
    });

    // Start the authentication flow
    const result = await request.promptAsync({
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    });

    // console.log(AuthSession.makeRedirectUri({ useProxy: true }));

    if (result.type === "success") {
      // Exchange the authorization code for tokens
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: GOOGLE_CLIENT_ID,
          code: result.params.code,
          redirectUri,
          extraParams: {
            code_verifier: request.codeVerifier || "",
          },
        },
        {
          tokenEndpoint: "https://oauth2.googleapis.com/token",
        }
      );

      // Create a Google credential with the ID token
      const googleCredential = GoogleAuthProvider.credential(
        tokenResponse.idToken
      );

      // Sign-in the user with the credential
      const userCredential = await signInWithCredential(auth, googleCredential);
      const user = userCredential.user;

      // Check if user exists in Firestore, if not create profile
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          provider: "google",
        });
      } else {
        // Update last login
        await setDoc(
          doc(db, "users", user.uid),
          {
            lastLogin: new Date().toISOString(),
          },
          { merge: true }
        );
      }

      // Store user data and tokens
      await storeUserData(user);

      return user;
    } else {
      throw new Error("Google Sign-In was cancelled or failed");
    }
  } catch (error: any) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
}

// Apple Sign-In
export async function signInWithApple() {
  try {
    // Check if Apple authentication is available
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      throw new Error("Apple Sign-In is not available on this device");
    }

    // Request Apple authentication
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // Create Firebase credential
    const { identityToken } = credential;
    if (!identityToken) {
      throw new Error("Apple Sign-In failed - no identity token");
    }

    const appleCredential = new OAuthProvider("apple.com").credential({
      idToken: identityToken,
    });

    // Sign-in the user with the credential
    const userCredential = await signInWithCredential(auth, appleCredential);
    const user = userCredential.user;

    // Check if user exists in Firestore, if not create profile
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        displayName:
          user.displayName ||
          `${credential.fullName?.givenName || ""} ${
            credential.fullName?.familyName || ""
          }`.trim(),
        email: user.email || credential.email,
        photoURL: null,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        provider: "apple",
      });
    } else {
      // Update last login
      await setDoc(
        doc(db, "users", user.uid),
        {
          lastLogin: new Date().toISOString(),
        },
        { merge: true }
      );
    }

    // Store user data and tokens
    await storeUserData(user);

    return user;
  } catch (error: any) {
    console.error("Apple Sign-In Error:", error);
    throw error;
  }
}

// Twitter Sign-In using Expo AuthSession
export async function signInWithTwitter() {
  try {
    // Create a redirect URI
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: "mademesmile",
      path: "auth",
    });

    // Create the auth request
    const request = new AuthSession.AuthRequest({
      clientId: "YOUR_TWITTER_API_KEY", // Replace with your Twitter API Key
      scopes: ["tweet.read", "users.read"],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      state: Math.random().toString(36).substring(7),
    });

    // Start the authentication flow
    const result = await request.promptAsync({
      authorizationEndpoint: "https://twitter.com/i/oauth2/authorize",
    });

    if (result.type === "success") {
      // Exchange the authorization code for tokens
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: "YOUR_TWITTER_API_KEY",
          code: result.params.code,
          redirectUri,
          extraParams: {
            code_verifier: request.codeVerifier || "",
          },
        },
        {
          tokenEndpoint: "https://api.twitter.com/2/oauth2/token",
        }
      );

      // Get user info from Twitter API
      const userInfoResponse = await fetch(
        "https://api.twitter.com/2/users/me",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
          },
        }
      );

      // Get user info from Twitter API (for future use)
      const userInfo = await userInfoResponse.json();
      console.log("Twitter user info:", userInfo);

      // Create a custom token or use Twitter's user info
      // Note: For production, you'll need to implement server-side token exchange
      // This is a simplified version for demonstration

      throw new Error(
        "Twitter Sign-In requires server-side implementation for production use. Please use Google or Apple Sign-In for now."
      );
    } else {
      throw new Error("Twitter Sign-In was cancelled or failed");
    }
  } catch (error: any) {
    console.error("Twitter Sign-In Error:", error);
    throw error;
  }
}
