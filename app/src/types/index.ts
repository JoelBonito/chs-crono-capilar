export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  locale: Locale;
  region: string;
  optInSMS: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type Locale = "fr-FR";

export interface AuthState {
  user: UserProfile | null;
  firebaseUser: import("firebase/auth").User | null;
  loading: boolean;
  error: string | null;
}
