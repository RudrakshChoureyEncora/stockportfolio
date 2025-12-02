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
  const [userStocks, setUserStocks] = useState();

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
          axios.interceptors.request.use((config) => {
            const token = localStorage.getItem("token");
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
          });
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
  const login = async (email, password, role) => {
    try {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await axios.post(
        "http://stockify-env.eba-2erwktvh.ap-south-1.elasticbeanstalk.com/api/login",
        {
          email: email,
          password: password,
        }
      );
      console.log(response);
      // If API returned success and user exists
      if (response.status === 200) {
        const userData = response.data.user;
        const token = response.data.token;
        const tokenExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes
        const userId = userData.userId;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        axios.interceptors.request.use((config) => {
          const token = localStorage.getItem("token");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        });
        const portfolioResponse = await axios.get(
          `http://stockify-env.eba-2erwktvh.ap-south-1.elasticbeanstalk.com/api/user-portfolio/${userId}`
        );

        // Store in localStorage

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

  const orderAction = async (u, s, q, p) => {
    try {
      setLoading(true);
      const orderData = {
        userId: u, // Replace with dynamic value if needed
        stockId: s,
        quantity: q,
        pricePerShare: p,
        purchaseDate: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
      };
      // console.log("this is in auth con");
      // console.log(orderData);
      try {
        const response = await axios.post(
          "http://stockify-env.eba-2erwktvh.ap-south-1.elasticbeanstalk.com/api/portfolio/update",
          orderData
        );

        if (response.status === 200) {
          setLoading(false);
          // alert("Order Submitted!");
          console.log("Order placed:", orderData);
          const portfolioResponse = await axios.get(
            `http://stockify-env.eba-2erwktvh.ap-south-1.elasticbeanstalk.com/api/user-portfolio/${u}`
          );

          // Store in localStorage
          localStorage.setItem(
            "userStocks",
            JSON.stringify(portfolioResponse.data)
          );

          setUserStocks(portfolioResponse.data);
          return { success: true, data: "order placed Successfully" };
        } else {
          setLoading(false);
          // alert("Failed to submit order. Please try again.");
          console.error("API error:", response.data);
          return { success: false };
        }
      } catch (error) {
        setLoading(false);
        // alert("Network error. Please check your connection.");

        return { success: false };
      }

      //---------------------------------------------------------------------------------------------------------------------------------
    } catch (error) {
      setLoading(false);
      return { success: false };
    } finally {
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

  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        "http://stockify-env.eba-2erwktvh.ap-south-1.elasticbeanstalk.com/api/admin/allUsers"
      );
      console.log("API Response:", response.data); // debug
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error deleting stock:", error);

      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  };

  // Delete a user by ID
  const deleteUser = async (emailId) => {
    try {
      const response = await axios.delete(
        `http://stockify-env.eba-2erwktvh.ap-south-1.elasticbeanstalk.com/api/admin/deleteUser/${emailId}`
      );
      console.log(response);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  };

  const updateUser = async (user) => {
    try {
      const response = await axios.put(
        "http://stockify-env.eba-2erwktvh.ap-south-1.elasticbeanstalk.com/api/admin/user/update",
        user // axios automatically JSON.stringify's objects
      );

      console.log("user updated");
      console.log(user);

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error updating stock:", error);

      if (error.response) {
        // Server responded with a status outside 2xx
        return { success: false, error: "Failed to update stock" };
      } else {
        // Network or other error
        return { success: false, error: "Network error" };
      }
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
    orderAction,
    getAllUsers,
    deleteUser,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
