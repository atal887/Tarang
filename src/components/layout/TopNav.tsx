import { Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, Map as MapIcon, Route } from "lucide-react";
import { cn } from "../../lib/utils";

export function TopNav() {
  const location = useLocation();

  const links = [
    { to: "/home", icon: Home, label: "Home" },
    { to: "/chat", icon: MessageCircle, label: "Chat" },
    { to: "/map", icon: MapIcon, label: "Map" },
    { to: "/active-trip", icon: Route, label: "Active Trip" },
  ];

  return (
    <header className="hidden md:flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 sticky top-0 z-50">
      <Link to="/home" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-ocean-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-ocean-600"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>
        </div>
        <span className="font-bold text-lg text-slate-900 tracking-tight">TARANG</span>
      </Link>
      
      <nav className="flex items-center gap-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          const Icon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-ocean-50 text-ocean-700" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
