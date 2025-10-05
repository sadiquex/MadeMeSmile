import { auth } from "@/firebase-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  User,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshUserToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = "@mademesmile_tokens";
const USER_STORAGE_KEY = "@mademesmile_user";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Store user data and tokens in AsyncStorage
  const storeUserData = async (userData: User) => {
    try {
      const userDataToStore = {
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        emailVerified: userData.emailVerified,
        lastSignInTime: userData.metadata.lastSignInTime,
        creationTime: userData.metadata.creationTime,
      };

      await AsyncStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(userDataToStore)
      );

      // Store the Firebase ID token
      const idToken = await userData.getIdToken();
      const refreshToken = userData.refreshToken;

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
  };

  // Retrieve user data from AsyncStorage
  const retrieveUserData = async (): Promise<User | null> => {
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

      return userData as User;
    } catch (error) {
      console.error("Error retrieving user data:", error);
      return null;
    }
  };

  // Clear stored user data and tokens
  const clearStoredData = async () => {
    try {
      await AsyncStorage.multiRemove([USER_STORAGE_KEY, TOKEN_STORAGE_KEY]);
    } catch (error) {
      console.error("Error clearing stored data:", error);
    }
  };

  // Refresh user token
  const refreshUserToken = async () => {
    if (user) {
      try {
        const newToken = await user.getIdToken(true); // Force refresh
        const refreshToken = user.refreshToken;

        await AsyncStorage.setItem(
          TOKEN_STORAGE_KEY,
          JSON.stringify({
            idToken: newToken,
            refreshToken,
            timestamp: Date.now(),
          })
        );
      } catch (error) {
        console.error("Error refreshing token:", error);
        // If token refresh fails, sign out the user
        await signOut();
      }
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      await clearStoredData();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await storeUserData(firebaseUser);
      } else {
        setUser(null);
        await clearStoredData();
      }
      setLoading(false);
    });

    // Check for stored user data on app start
    const checkStoredAuth = async () => {
      try {
        const storedUser = await retrieveUserData();
        if (storedUser && !auth.currentUser) {
          // If we have stored data but no current user, clear storage
          await clearStoredData();
        }
      } catch (error) {
        console.error("Error checking stored auth:", error);
      }
    };

    checkStoredAuth();

    return () => unsubscribe();
  }, []);

  // Set up automatic token refresh
  useEffect(() => {
    if (user) {
      const refreshInterval = setInterval(() => {
        refreshUserToken();
      }, 45 * 60 * 1000); // Refresh every 45 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    signOut,
    refreshUserToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
