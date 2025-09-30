import { auth, db } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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

  // Create Firestore profile
  await setDoc(doc(db, "users", user.uid), {
    displayName,
    email: user.email,
    photoURL: null,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  });

  return user;
}

export async function signIn(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}
