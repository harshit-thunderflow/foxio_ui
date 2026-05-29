import { Button } from "@/components/ui/button";

interface DiscardModalProps {
  open: boolean;
  onDiscard: () => void;
  onCancel: () => void;
}

export function DiscardModal({ open, onDiscard, onCancel }: DiscardModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20">
      <div className="bg-card text-card-foreground border border-border shadow-lg p-6 w-full max-w-xs space-y-4">
        <p className="text-sm font-semibold">Discard changes?</p>
        <p className="text-xs text-muted-foreground">
          You have unsaved changes. Are you sure you want to discard them?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Keep editing
          </Button>
          <Button variant="destructive" size="sm" onClick={onDiscard}>
            Discard
          </Button>
        </div>
      </div>
    </div>
  );
}
