import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

const AuthContext = createContext(null);

// Get API URL from Vite environment variable.
// Falls back to localhost for local development.
const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("kp_token")
  );

  const [admin, setAdmin] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // CHECK EXISTING ADMIN LOGIN
  useEffect(() => {
    if (!token) {
      setCheckingAuth(false);
      return;
    }

    axios
      .get(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAdmin(res.data);
      })
      .catch((error) => {
        console.error("Authentication check failed:", error);

        localStorage.removeItem("kp_token");
        setToken(null);
        setAdmin(null);
      })
      .finally(() => {
        setCheckingAuth(false);
      });
  }, [token]);

  // ADMIN LOGIN
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("kp_token", res.data.token);

      setToken(res.data.token);
      setAdmin(res.data.admin);

      return res.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // ADMIN LOGOUT
  const logout = () => {
    localStorage.removeItem("kp_token");

    setToken(null);
    setAdmin(null);
  };

  const value = {
    token,
    admin,
    isAuthenticated: Boolean(token),
    checkingAuth,
    login,
    logout,

    // Used by Contact.jsx and other API requests
    apiBase: API_BASE,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return ctx;
}