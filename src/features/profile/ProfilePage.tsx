import { useAuth, useProfile, usePageTitle } from "@/hooks";
import { LoginForm } from "@/components/common/LoginForm";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LogOut, Phone, Calendar, MapPin, User, Loader2, Pencil } from "lucide-react";
import { useState, useCallback } from "react";
import { EditProfileForm } from "./components/EditProfileForm";
import { ProfileAvatarEditor } from "./components/ProfileAvatarEditor";

export function ProfilePage() {
  usePageTitle("Profile");
  const { isAuthenticated, user, logout } = useAuth();
  const { profile, loading, error, refetch } = useProfile();
  const [loggingOut, setLoggingOut] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
  };

  const handleUpdateSuccess = useCallback(async () => {
    setEditing(false);
    await refetch();
  }, [refetch]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <LoginForm />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-4">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  const firstName = profile?.first_name || "";
  const lastName = profile?.last_name || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || user?.email?.split("@")[0] || "User";
  const initials = firstName && lastName
    ? `${firstName[0]}${lastName[0]}`.toUpperCase()
    : fullName.slice(0, 2).toUpperCase();

  const infoItems = [
    { icon: Phone, label: "Phone", value: profile?.phone_number || "Not provided" },
    { icon: Calendar, label: "Birthday", value: profile?.date_of_birth || "Not provided" },
    { icon: User, label: "Gender", value: profile?.gender || "Not provided" },
    { icon: MapPin, label: "Country", value: profile?.country || "Not provided" },
  ];

  return (
    <div className="flex flex-col min-h-0 w-full">

      <Card className="mt-4 rounded-none! shadow-md! w-full">
        <CardContent className="flex! flex-col! md:flex-row! md:items-center! gap-6! md:gap-8! px-6!">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4 md:min-w-50">
            <ProfileAvatarEditor
              currentImage={profile?.profile_image || null}
              initials={initials}
              onUpdated={refetch}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-card-foreground truncate">{fullName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>

          <Separator className="md:hidden" />
          <Separator orientation="vertical" className="hidden md:block h-16" />

          {/* Info items */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
            {infoItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">{label}:</span>
                <span className="text-card-foreground truncate capitalize">{value}</span>
              </div>
            ))}
          </div>

          <Separator className="md:hidden" />
          <Separator orientation="vertical" className="hidden md:block h-16" />

          {/* Actions */}
          <div className="flex items-center gap-3 md:flex-col md:gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => setEditing(true)}
              disabled={editing}
            >
              <Pencil className="h-3 w-3" /> Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 text-xs"
              disabled={loggingOut || editing}
              onClick={handleLogout}
            >
              <LogOut className="h-3.5 w-3.5" />
              {loggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      {editing && profile && (
        <Card className="mt-4 rounded-none! shadow-md1 w-full">
          <CardContent className="px-6! py-6!">
            <EditProfileForm
              profile={profile}
              onCancel={() => setEditing(false)}
              onSuccess={handleUpdateSuccess}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
