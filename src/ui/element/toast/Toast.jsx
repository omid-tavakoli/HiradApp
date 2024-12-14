import toast, { Toaster } from "react-hot-toast";

export const ShowToast = (message) => {
  toast(message);
};

export const ToastProvider = () => {
  return <Toaster />;
};
