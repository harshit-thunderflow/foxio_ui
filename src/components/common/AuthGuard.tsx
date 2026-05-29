import { Card, CardContent } from "@/components/ui/card";
import { LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";

export function AuthGuard() {
  return (
    <div className="flex items-center justify-center h-full p-4">
      <Card className="w-full max-w-xs text-center shadow-md border border-border">
        <CardContent className="pt-6 space-y-3">
          <LockKeyhole className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">Sign in required</p>
          <p className="text-xs text-muted-foreground">
            Please <Link to="/profile" className="text-primary underline underline-offset-2">sign in</Link> to access this page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
