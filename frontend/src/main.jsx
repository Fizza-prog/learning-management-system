import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/variable.css";
import "./index.css";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./features/auth/context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
 <AuthProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</AuthProvider>
);