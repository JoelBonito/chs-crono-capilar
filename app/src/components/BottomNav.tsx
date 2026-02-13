import { NavLink } from "react-router-dom";
import { Home, ScanFace, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Accueil", icon: Home },
  { to: "/diagnostic", label: "Diagnostic", icon: ScanFace },
  { to: "/calendrier", label: "Calendrier", icon: Calendar },
  { to: "/parametres", label: "Paramètres", icon: Settings },
];

export function BottomNav() {
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
