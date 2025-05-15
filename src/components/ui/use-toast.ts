import { createContext, useContext } from "react";

const ToastContext = createContext({ toast: (options: any) => {} });

export function useToast() {
  return useContext(ToastContext);
}