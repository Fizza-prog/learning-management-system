/**
 * @file AuthContext.jsx
 * @description Provides shared authentication state and account actions.
 *
 * Responsibilities:
 * - Load and expose the current authenticated user.
 * - Manage login, logout, and related session state.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { logoutUser } from "../../../api/authApi";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("accessToken")
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("accessToken");

    if (
      savedUser &&
      savedUser !== "undefined" &&
      savedToken
    ) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (error) {
        console.error(
          "Invalid saved user data:",
          error
        );

        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      }
    }

    setLoading(false);
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "accessToken",
      userToken
    );
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearAuth();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}