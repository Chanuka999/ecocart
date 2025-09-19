import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { ToastContext } from "./ToastContext";

export function ToastProvider({ children }) {
  const [open, setOpen] = React.useState(false);
  const [toastContent, setToastContent] = React.useState({
    title: "",
    description: "",
  });

  const toast = ({ title, description }) => {
    setToastContent({ title, description });
    setOpen(true);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        <ToastPrimitive.Root open={open} onOpenChange={setOpen}>
          <ToastPrimitive.Title>{toastContent.title}</ToastPrimitive.Title>
          {toastContent.description && (
            <ToastPrimitive.Description>
              {toastContent.description}
            </ToastPrimitive.Description>
          )}
          <ToastPrimitive.Action asChild altText="Close">
            <button onClick={() => setOpen(false)}>Close</button>
          </ToastPrimitive.Action>
        </ToastPrimitive.Root>
        <ToastPrimitive.Viewport />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

// Move useToast to a separate file (useToastHook.js or similar)
