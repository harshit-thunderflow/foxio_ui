import { Outlet } from "react-router-dom";
import { AppHeader } from "@/components/common/AppHeader";
import { Sidebar } from "@/components/common/Sidebar";

export function AppLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
