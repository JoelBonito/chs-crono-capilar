import {
  createContext,
  useContext,
  useEffect,
  useRef,
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
import i18n from "@/i18n";
import type { UserProfile, Locale } from "@/types";

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
  refreshProfile: () => Promise<void>;
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
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // AUTH-01: use a per-callback `active` flag to prevent stale async updates
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      let active = true;
      setFirebaseUser(fbUser);
      if (fbUser) {
        fetchUserProfile(fbUser.uid).then((profile) => {
          if (active && mountedRef.current) {
            setUser(profile);
            setLoading(false);
          }
        });
      } else {
        setUser(null);
        setLoading(false);
      }
      // Invalidate this callback's async chain on next auth event
      return () => { active = false; };
    });
    return unsubscribe;
  }, []);

  // AUTH-02 + AUTH-03: single fetchUserProfile call; onAuthStateChanged sets user state
  const signInWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const existing = await fetchUserProfile(fbUser.uid);

      if (!existing) {
        await setDoc(doc(db, "users", fbUser.uid), {
          email: fbUser.email,
          firstName: fbUser.displayName?.split(" ")[0] ?? "",
          lastName: fbUser.displayName?.split(" ").slice(1).join(" ") ?? "",
          phoneNumber: "",
          locale: i18n.language as Locale,
          region: "europe-west1",
          optInSMS: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      // onAuthStateChanged is the single source of truth for setUser
    } catch (error) {
      if (import.meta.env.DEV) console.log("[Auth] Google sign-in error:", error);
      throw error;
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  // AUTH-03: removed setUser call — onAuthStateChanged handles it
  const signUpWithEmail = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(result.user);
      await setDoc(doc(db, "users", result.user.uid), {
        email,
        firstName,
        lastName,
        phoneNumber: "",
        locale: i18n.language as Locale,
        region: "europe-west1",
        optInSMS: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    },
    [],
  );

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setUser(null);
  }, []);

  // SETTINGS-01: expose refreshProfile for post-save sync
  const refreshProfile = useCallback(async () => {
    if (!firebaseUser) return;
    const profile = await fetchUserProfile(firebaseUser.uid);
    if (mountedRef.current) setUser(profile);
  }, [firebaseUser]);

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
        refreshProfile,
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
