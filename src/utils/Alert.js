import { toast } from "react-toastify";

export const customAlert = (msg, state) => {
    if (state === "success") {
        toast.success(msg || "success !");
    } else {
        toast.error(msg || "Some thing wrong !");
    }
};
