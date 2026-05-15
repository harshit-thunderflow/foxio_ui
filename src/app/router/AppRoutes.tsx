import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/app/layout/AppLayout";
import { OverviewPage } from "@/features/dashboard/OverviewPage";
import { LibraryPage } from "@/features/library/LibraryPage";
import { TutorialPage } from "@/features/tutorial/TutorialPage";
import { ChatbotPage } from "@/features/chatbot/ChatbotPage";
import { ProfilePage } from "@/features/profile/ProfilePage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/tutorial" element={<TutorialPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Route>
    </Routes>
  );
}
