import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { TopNav } from "./TopNav";

export function Layout() {
  const location = useLocation();
  const hideNav = location.pathname === "/" || location.pathname === "/landing";

  return (
    <div className="flex min-h-[100dvh] flex-col bg-slate-50 font-sans">
      {!hideNav && <TopNav />}
      <main className="flex-1 w-full max-w-5xl mx-auto overflow-y-auto pb-24 md:pb-8">
        <Outlet />
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
