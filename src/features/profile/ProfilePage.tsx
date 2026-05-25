import { useHostUrl } from "@/hooks";
import { PageTitle } from "@/components/common/PageTitle";

export function ProfilePage() {
  const { url, loading, error } = useHostUrl();

  return (
    <div className="flex flex-col h-full overflow-hidden space-y-4">
      <PageTitle name="Profile" />
      <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Profile</h1>
      <div className="rounded-md border border-border p-4">
        <p className="text-sm text-muted-foreground">Host URL:</p>
        {loading && <p className="text-sm text-muted-foreground">Detecting host...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {url && <p className="text-sm font-mono text-foreground break-all">{url}</p>}
      </div>
    </div>
  );
}
