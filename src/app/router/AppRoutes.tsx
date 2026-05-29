import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/app/layout/AppLayout";
import { OverviewPage } from "@/features/dashboard/OverviewPage";
import { LibraryPage } from "@/features/library/LibraryPage";
import { TutorialPage } from "@/features/tutorial/TutorialPage";
import { ChatbotPage } from "@/features/chatbot/ChatbotPage";
import { ProfilePage } from "@/features/profile/ProfilePage";
import { AuthGuard } from "@/components/common/AuthGuard";
import { useAuth } from "@/hooks";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <AuthGuard />;
}

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/overview" element={<ProtectedRoute><OverviewPage /></ProtectedRoute>} />
        <Route path="/tutorial" element={<ProtectedRoute><TutorialPage /></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><LibraryPage /></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/tutorial" : "/profile"} replace />} />
      </Route>
    </Routes>
  );
}
