import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { BottomNav } from "@/components/BottomNav";

import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ProfileSetup from "@/pages/ProfileSetup";
import LegalNotice from "@/pages/LegalNotice";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import Dashboard from "@/pages/Dashboard";
import Diagnostic from "@/pages/Diagnostic";
import CalendarPage from "@/pages/CalendarPage";
import Settings from "@/pages/Settings";

// M1: /profile-setup requires a Firebase session (user must be logged in)
// but does not require a completed profile, so we use a minimal auth guard.
import { useAuth } from "@/features/auth/AuthContext";
import { Navigate as NavRedirect } from "react-router-dom";

function RequireFirebaseUser({ children }: { children: React.ReactNode }) {
  const { firebaseUser, loading } = useAuth();
  if (loading) return null;
  if (!firebaseUser) return <NavRedirect to="/login" replace />;
  return <>{children}</>;
}

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
      <BottomNav />
    </ProtectedRoute>
  );
}

export const router = createBrowserRouter([
  // Public routes
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/mentions-legales", element: <LegalNotice /> },
  { path: "/politique-de-confidentialite", element: <PrivacyPolicy /> },
  { path: "/cgu", element: <TermsOfService /> },

  // Requires Firebase auth (but not full profile)
  {
    path: "/profile-setup",
    element: (
      <RequireFirebaseUser>
        <ProfileSetup />
      </RequireFirebaseUser>
    ),
  },

  // Protected routes (full profile required)
  {
    element: <ProtectedLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/diagnostic", element: <Diagnostic /> },
      { path: "/calendrier", element: <CalendarPage /> },
      { path: "/parametres", element: <Settings /> },
    ],
  },

  // Catch-all
  { path: "*", element: <Navigate to="/" replace /> },
]);
