import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common/Loader";
import { DiscardModal } from "@/components/common/DiscardModal";
import { updateProfileApi, type UpdateProfileRequest } from "@/services/profile";
import { useToast } from "@/hooks/useToast";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import type { UserProfile } from "@/services/profile";

interface EditProfileFormProps {
  profile: UserProfile;
  onCancel: () => void;
  onSuccess: () => void;
}

export function EditProfileForm({ profile, onCancel, onSuccess }: EditProfileFormProps) {
  const [form, setForm] = useState<UpdateProfileRequest>({
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",
    phone_number: profile.phone_number || "",
    date_of_birth: profile.date_of_birth || "",
    gender: profile.gender || "",
    country: profile.country || "",
  });
  const [loading, setLoading] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const { toast } = useToast();
  const { registerBlocker, unregisterBlocker } = useNavigationGuard();

  const dirty =
    form.first_name !== (profile.first_name || "") ||
    form.last_name !== (profile.last_name || "") ||
    form.phone_number !== (profile.phone_number || "") ||
    form.date_of_birth !== (profile.date_of_birth || "") ||
    form.gender !== (profile.gender || "") ||
    form.country !== (profile.country || "");

  useEffect(() => {
    registerBlocker(() => dirty);
    return () => unregisterBlocker();
  }, [dirty, registerBlocker, unregisterBlocker]);

  const handleCancel = () => {
    if (dirty) setShowDiscard(true);
    else onCancel();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([_, v]) => v !== "")
      );
      await updateProfileApi(payload);
      toast("Profile updated successfully", "success");
      onSuccess();
    } catch (err: any) {
      toast(err.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const update = (field: keyof UpdateProfileRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const fields: { key: keyof UpdateProfileRequest; label: string; placeholder: string; type?: string }[] = [
    { key: "first_name", label: "First Name", placeholder: "Rahul" },
    { key: "last_name", label: "Last Name", placeholder: "Sharma" },
    { key: "phone_number", label: "Phone", placeholder: "+91-9876543210" },
    { key: "date_of_birth", label: "Date of Birth", placeholder: "1990-03-15", type: "date" },
    { key: "gender", label: "Gender", placeholder: "male" },
    { key: "country", label: "Country", placeholder: "India" },
  ];

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(({ key, label, placeholder, type }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                type={type || "text"}
                placeholder={placeholder}
                value={form[key] || ""}
                onChange={(e) => update(key, e.target.value)}
                style={{ borderWidth: "1px", borderStyle: "solid", borderColor: "var(--border)" }}
                className="transition-all focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={loading || !dirty}
            className="transition-all duration-200 hover:opacity-90 hover:shadow-md active:scale-[0.98]"
          >
            {loading ? <><Spinner size="sm" /> Updating...</> : "Update Profile"}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>

      <DiscardModal
        open={showDiscard}
        onCancel={() => setShowDiscard(false)}
        onConfirm={onCancel}
        cancelText="Keep editing"
      />
    </>
  );
}
