import { ToastProvider } from "../../hooks/useToast";

export function Toaster({ children }) {
  return <ToastProvider>{children}</ToastProvider>;
}
