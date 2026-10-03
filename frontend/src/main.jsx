/**
 * @file main.jsx
 * @description Initializes the frontend entry point and global providers.
 *
 * Responsibilities:
 * - Load global styles and mount the React application.
 * - Provide routing and authentication context to the component tree.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./styles/reset.css";
import "./styles/variable.css";
import "./styles/global.css";
import "./index.css";
import "./styles/dashboard.css";

import { BrowserRouter } from "react-router";
import { AuthProvider } from "./features/auth/context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);