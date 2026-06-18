import { Outlet } from "react-router-dom";
import { AppHeader } from "@/components/common/AppHeader";
import { Sidebar } from "@/components/common/Sidebar";
import { ToastContainer } from "@/components/ui/toast";

export function AppLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <ToastContainer />
      </div>
    </div>
  );
}
