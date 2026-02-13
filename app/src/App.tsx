import "@/i18n";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/features/auth/AuthContext";
import { I18nSync } from "@/i18n/I18nSync";
import { initAppCheck } from "@/lib/appCheck";
import { router } from "@/app/router";

initAppCheck();

export default function App() {
  return (
    <AuthProvider>
      <I18nSync />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
