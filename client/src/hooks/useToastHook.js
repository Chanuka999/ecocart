import * as React from "react";
import { ToastContext } from "./ToastContext";

export function useToast() {
  return React.useContext(ToastContext);
}
