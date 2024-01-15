import toast from "react-hot-toast";

export const successToast = (text) => {
  return toast.success(text, {
    duration: 2500,
    position: "top-center",
    icon: "👓",
    style: {
      backgroundColor: "green",
      color: "white",
    },
  });
};

export const bigSuccessToast = (text) => {
  return toast.success(text, {
    duration: 1500,
    position: "top-center",
    icon: "🫶",
    style: {
      backgroundColor: "green",
      color: "white",
    },
  });
};

export const errorToast = (text) => {
  return toast.success(text, {
    duration: 2500,
    position: "top-center",
    icon: "🚫",
    style: {
      backgroundColor: "#FCA311",
      color: "white",
    },
  });
};

export const warningToast = (text) => {
  return toast.success(text, {
    duration: 2500,
    position: "top-center",
    icon: "🤯",
    style: {
      backgroundColor: "#FCA311",
      color: "white",
    },
  });
};

export const dangerToast = (text) => {
  return toast.success(text, {
    duration: 2500,
    position: "top-center",
    icon: "💀",
    style: {
      backgroundColor: "#FCA311",
      color: "white",
    },
  });
};
