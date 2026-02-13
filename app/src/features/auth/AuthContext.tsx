import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { UserProfile } from "@/types";

interface AuthContextValue {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const googleProvider = new GoogleAuthProvider();

async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    uid,
    email: data.email ?? "",
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    phoneNumber: data.phoneNumber ?? "",
    locale: data.locale ?? "fr-FR",
    region: data.region ?? "europe-west1",
    optInSMS: data.optInSMS ?? false,
    createdAt: data.createdAt?.toDate() ?? new Date(),
    updatedAt: data.updatedAt?.toDate() ?? new Date(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const profile = await fetchUserProfile(fbUser.uid);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    console.log("[Auth] Starting Google sign-in...");

    try {
      console.log("[Auth] Opening popup...");
      const result = await signInWithPopup(auth, googleProvider);
      console.log("[Auth] Popup successful, user:", result.user.email);

      const fbUser = result.user;
      const existing = await fetchUserProfile(fbUser.uid);
      console.log("[Auth] Existing profile:", existing ? "found" : "not found");

      if (!existing) {
        console.log("[Auth] Creating new user profile...");
        await setDoc(doc(db, "users", fbUser.uid), {
          email: fbUser.email,
          firstName: fbUser.displayName?.split(" ")[0] ?? "",
          lastName: fbUser.displayName?.split(" ").slice(1).join(" ") ?? "",
          phoneNumber: "",
          locale: "fr-FR",
          region: "europe-west1",
          optInSMS: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        console.log("[Auth] Profile created");
      }

      const profile = await fetchUserProfile(fbUser.uid);
      setUser(profile);
      console.log("[Auth] Sign-in complete");
    } catch (error) {
      console.error("[Auth] Sign-in error:", error);
      throw error;
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUpWithEmail = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(result.user);
      await setDoc(doc(db, "users", result.user.uid), {
        email,
        firstName,
        lastName,
        phoneNumber: "",
        locale: "fr-FR",
        region: "europe-west1",
        optInSMS: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      const profile = await fetchUserProfile(result.user.uid);
      setUser(profile);
    },
    [],
  );

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
