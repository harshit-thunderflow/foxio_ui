import { createContext, useContext } from "react";

export type ToastType = "success" | "warning" | "error";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
  _toasts: ToastItem[];
  _setToasts: React.Dispatch<React.SetStateAction<ToastItem[]>>;
}

export const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
  _toasts: [],
  _setToasts: () => {},
});

export const useToast = () => useContext(ToastContext);
