import { useState } from "react";
import { Card, CardContent, CardDescription, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks";
import { Spinner } from "@/components/common/Loader";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const { login, loading, error: apiError } = useAuth();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!validate()) return;
    await login(email, password);
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  return (
    <Card className="w-full max-w-sm shadow-lg border border-border">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {apiError && (
            <p className="text-xs text-destructive text-center">{apiError}</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              maxLength={50}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              style={{
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: touched.email && errors.email ? "var(--destructive)" : "var(--border)",
              }}
              className={`transition-all focus-visible:ring-2 ${
                touched.email && errors.email
                  ? "focus-visible:!ring-destructive/40"
                  : "focus-visible:ring-ring"
              }`}
            />
            {touched.email && errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              maxLength={32}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              style={{
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: touched.password && errors.password ? "var(--destructive)" : "var(--border)",
              }}
              className={`transition-all focus-visible:ring-2 ${
                touched.password && errors.password
                  ? "focus-visible:!ring-destructive/40"
                  : "focus-visible:ring-ring"
              }`}
            />
            {touched.password && errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2 transition-all duration-200 hover:opacity-90 hover:shadow-md active:scale-[0.98]"
          >
            {loading ? <><Spinner size="sm" /> Logging in...</> : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
