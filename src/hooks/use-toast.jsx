import { sonner } from "sonner";

export const toast = sonner;

export const useToast = () => {
  return {
    toast: sonner,
    toasts: [],
    dismiss: () => {},
  };
};