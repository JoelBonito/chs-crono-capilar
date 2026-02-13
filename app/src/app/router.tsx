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

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
      <BottomNav />
    </ProtectedRoute>
  );
}

export const router = createBrowserRouter(
  [
    // Public routes
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/profile-setup", element: <ProfileSetup /> },
    { path: "/mentions-legales", element: <LegalNotice /> },
    { path: "/politique-de-confidentialite", element: <PrivacyPolicy /> },
    { path: "/cgu", element: <TermsOfService /> },

    // Protected routes
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
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);
