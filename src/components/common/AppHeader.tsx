import { X, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFoxio } from "@/app/providers/FoxioProvider";

export function AppHeader() {
  const { title } = useFoxio();
  const [isMaximized, setIsMaximized] = useState(false);

  const handleClose = () => {
    window.parent.postMessage("foxio-close", "*");
  };

  const handleToggleMaximize = () => {
    const next = !isMaximized;
    setIsMaximized(next);
    window.parent.postMessage(next ? "foxio-maximize" : "foxio-minimize", "*");
  };

  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        boxShadow: "0 2px 6px -1px rgba(0,0,0,0.08)",
      }}
      className="flex h-12 shrink-0 items-center justify-between px-4"
    >
      <span className="text-lg font-bold text-primary">{title}</span>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" onClick={handleToggleMaximize}>
          {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={handleClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
