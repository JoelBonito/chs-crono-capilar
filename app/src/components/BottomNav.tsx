import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, ScanFace, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const { t } = useTranslation("common");

  const navItems = [
    { to: "/dashboard", label: t("nav.home"), icon: Home },
    { to: "/diagnostic", label: t("nav.diagnostic"), icon: ScanFace },
    { to: "/calendrier", label: t("nav.calendar"), icon: Calendar },
    { to: "/parametres", label: t("nav.settings"), icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-sticky border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-caption transition-colors duration-fast",
                isActive ? "text-gold-500" : "text-gray-400 hover:text-gray-600",
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
