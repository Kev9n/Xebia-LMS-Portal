import { toast as sonnerToast } from "sonner";

export const toast = {
  add: (message, type = "default") => {
    switch (type) {
      case "success":
        sonnerToast.success(message);
        break;
      case "error":
        sonnerToast.error(message);
        break;
      case "info":
        sonnerToast.info(message);
        break;
      case "warning":
        sonnerToast.warning(message);
        break;
      default:
        sonnerToast(message);
        break;
    }
  },
  success: (message) => sonnerToast.success(message),
  error: (message) => sonnerToast.error(message),
  info: (message) => sonnerToast.info(message),
  warning: (message) => sonnerToast.warning(message),
  dismiss: (toastId) => sonnerToast.dismiss(toastId),
};
