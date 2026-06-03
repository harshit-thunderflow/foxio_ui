import { useState, useCallback, useRef } from "react";
import { X, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { ToastContext, useToast, type ToastType } from "@/hooks/useToast";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, _toasts: toasts, _setToasts: setToasts }}>
      {children}
    </ToastContext.Provider>
  );
}

export function ToastContainer() {
  const { _toasts: toasts, _setToasts: setToasts } = useToast();

  if (toasts.length === 0) return null;

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons: Record<string, React.ReactNode> = {
    success: <CheckCircle className="h-4 w-4 shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 shrink-0" />,
    error: <XCircle className="h-4 w-4 shrink-0" />,
  };

  const colors: Record<string, string> = {
    success: "bg-card border-green-500/40 text-green-600",
    warning: "bg-card border-yellow-500/40 text-yellow-600",
    error: "bg-card border-destructive/40 text-destructive",
  };

  return (
    <div className="absolute top-20 right-3 z-[9999] flex flex-col gap-2 pointer-events-none max-w-[280px]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-md border shadow-lg text-xs animate-slide-down ${colors[t.type]}`}
        >
          {icons[t.type]}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => dismiss(t.id)} className="opacity-60 hover:opacity-100">
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
