import { Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, Map as MapIcon, Route } from "lucide-react";
import { cn } from "../../lib/utils";

export function BottomNav() {
  const location = useLocation();

  const links = [
    { to: "/home", icon: Home, label: "Home" },
    { to: "/chat", icon: MessageCircle, label: "Chat" },
    { to: "/map", icon: MapIcon, label: "Map" },
    { to: "/active-trip", icon: Route, label: "Trip" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-[68px] items-center justify-around border-t border-slate-200 bg-white pb-safe shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.05)]">
      {links.map((link) => {
        const isActive = location.pathname === link.to;
        const Icon = link.icon;
        return (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-slate-400 transition-colors",
              isActive && "text-ocean-600"
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-12 h-8 rounded-full mb-1 transition-colors",
              isActive && "bg-ocean-50"
            )}>
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={cn("text-[10px] font-medium", isActive ? "text-ocean-700" : "")}>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
