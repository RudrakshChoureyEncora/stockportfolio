// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userStocks, setUserStocks] = useState(null);

  // Check for existing token on app start
  useEffect(() => {
    console.log("This is getting called...");
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      const tokenExpiry = localStorage.getItem("tokenExpiry");
      const userStockData = localStorage.getItem("userStocks");
      if (token && userData && tokenExpiry) {
        // Check if token is expired
        if (Date.now() > parseInt(tokenExpiry)) {
          logout();
        } else {
          setUser(JSON.parse(userData));
          setUserStocks(JSON.parse(userStockData));
          // Set auto-logout when token expires
          const timeUntilExpiry = parseInt(tokenExpiry) - Date.now();
          setTimeout(logout, timeUntilExpiry);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Mock login function - replace with actual API call
  const login = async (email, password) => {
    try {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation

      // if (email === "user@example.com" && password === "password") {
      //   const userData = {
      //     id: 1,
      //     email: email,
      //     name: "John Doe",
      //     role: "user",
      //   };

      //
      //   const token = "mock_jwt_token_" + Date.now();
      //   const tokenExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes

      //   // Store in localStorage
      //   localStorage.setItem("token", token);
      //   localStorage.setItem("user", JSON.stringify(userData));
      //   localStorage.setItem("tokenExpiry", tokenExpiry.toString());

      //   setUser(userData);

      //   // Set auto-logout
      //   setTimeout(logout, 30 * 60 * 1000);

      //   return { success: true };
      // } else {
      //   return { success: false, error: "Invalid credentials" };
      // }

      const response = await axios.post("/api/login", {
        email: email,
        password: password,
      });
      console.log(response);
      // If API returned success and user exists
      if (response.status === 200) {
        const userData = response.data;
        const token = "mock_jwt_token_" + Date.now();
        const tokenExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes
        const userId = userData.userId;
        const portfolioResponse = await axios.get(
          `/api/user-portfolio/${userId}`
        );

        // Store in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem(
          "userStocks",
          JSON.stringify(portfolioResponse.data)
        );
        localStorage.setItem("tokenExpiry", tokenExpiry.toString());
        setUser(userData);
        console.log(userData);

        setUserStocks(portfolioResponse.data);

        // Auto-logout after 30 min
        setTimeout(logout, 30 * 60 * 1000);
        return { success: true };
      } else {
        return { success: false, error: "Invalid credentials" };
      }
    } catch (error) {
      return { success: false, error: "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("userStocks");

    // Clear state
    setUser(null);
    setUserStocks(null);

    console.log("User logged out");
  };

  // Check if token is about to expire (within 5 minutes)
  const isTokenExpiringSoon = () => {
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    if (!tokenExpiry) return true;
    const timeUntilExpiry = parseInt(tokenExpiry) - Date.now();
    return timeUntilExpiry < 5 * 60 * 1000; // 5 minutes
  };

  // Refresh token - mock function
  const refreshToken = async () => {
    try {
      const tokenExpiry = Date.now() + 30 * 60 * 1000; // Another 30 minutes
      localStorage.setItem("tokenExpiry", tokenExpiry.toString());

      // Set new auto-logout
      setTimeout(logout, 30 * 60 * 1000);

      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };

  const value = {
    user,
    userStocks,
    login,
    logout,
    loading,
    isTokenExpiringSoon,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
