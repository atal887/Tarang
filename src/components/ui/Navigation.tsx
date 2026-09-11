import { NavLink, Outlet } from "react-router-dom";
import { Home, MessageCircle, Map as MapIcon, History, Settings } from "lucide-react";

export function Navigation() {
  const navItems = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Chat", path: "/chat", icon: MessageCircle },
    { name: "Map", path: "/map", icon: MapIcon },
    { name: "History", path: "/history", icon: History },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50">
      
      {/* Desktop Top Nav */}
      <header className="hidden md:flex items-center justify-between px-8 h-16 bg-white border-b border-slate-200 shrink-0">
        <div className="font-extrabold text-xl tracking-tight text-slate-900">TARANG</div>
        <nav className="flex items-center gap-1">
          {navItems.map(item => (
            <NavLink 
              key={item.name} 
              to={item.path} 
              className={({isActive}) => `flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${isActive ? 'bg-ocean-50 text-ocean-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <item.icon className="w-4 h-4" /> {item.name}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative flex flex-col">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden flex items-center justify-around bg-white border-t border-slate-200 shrink-0 pt-2 pb-safe z-50 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.05)]">
        {navItems.map(item => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({isActive}) => `flex flex-col items-center justify-center w-full pb-2 space-y-1 ${isActive ? 'text-ocean-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {({isActive}) => (
              <>
                <item.icon className={`w-6 h-6 ${isActive ? 'fill-ocean-50/50' : ''}`} />
                <span className={`text-[10px] font-bold ${isActive ? 'text-ocean-700' : ''}`}>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

    </div>
  );
}
