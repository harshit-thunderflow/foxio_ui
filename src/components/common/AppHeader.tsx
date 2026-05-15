import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFoxio } from "@/app/providers/FoxioProvider";

export function AppHeader() {
  const { title, onClose } = useFoxio();

  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        boxShadow: "0 2px 6px -1px rgba(0,0,0,0.08)",
      }}
      className="flex h-12 shrink-0 items-center justify-between px-4"
    >
      <span className="text-lg font-bold text-primary">{title}</span>
      {onClose && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          className="sm:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </header>
  );
}
