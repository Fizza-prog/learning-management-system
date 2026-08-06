import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AppToast() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
    />
  );
}

export default AppToast;