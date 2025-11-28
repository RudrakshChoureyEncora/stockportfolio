import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/auth/Login";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoutes";
import Register from "./components/auth/Register";
import { RUProvider } from "./context/RegisterUserContext";
import { StockProvider } from "./context/StockCon";
import PortfolioTracker from "./PortfolioTracker";
import { useEffect } from "react";
import Home from "./components/Home";
import StockDetails from "./components/stock/StockDetails";
import OrderStock from "./components/dashboard/OrderStock";

// Profile component (example of another protected route)
const Profile = () => {
  const { user } = useAuth();
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>{user.firstName + " " + user.lastName}</h1>
        <p className="email">{user.email}</p>
      </div>

      <div className="profile-section">
        <h2>Account Details</h2>
        <div className="profile-grid">
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone || "Not provided"}
          </p>
          <p>
            <strong>Date of Birth:</strong> {user.dateOfBirth}
          </p>
          <p>
            <strong>Role:</strong> {user.role || "User"}
          </p>
        </div>
      </div>

      <div className="profile-section">
        <h2>Investment Profile</h2>
        <div className="profile-grid">
          <p>
            <strong>Risk Appetite:</strong> {user.riskAppetite}
          </p>
          <p>
            <strong>Experience:</strong> {user.experience}
          </p>
          <p>
            <strong>Investment Goal:</strong> {user.investmentGoal}
          </p>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <StockProvider>
          <BrowserRouter>
            <div className="App">
              <Navbar />
              <main className="main-content">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/stock/:stockId" element={<StockDetails />} />
                  <Route
                    path="/register"
                    element={
                      <RUProvider>
                        <Register />
                      </RUProvider>
                    }
                  />
                  {/* Protected routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <div className="App">
                          <PortfolioTracker />
                        </div>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orderStock"
                    element={
                      <ProtectedRoute>
                        <OrderStock />
                      </ProtectedRoute>
                    }
                  />
                  {/* Admin route example (role-based)
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <div className="admin-panel">
                        <h1>Admin Panel</h1>
                        <p>This is only accessible to admins.</p>
                      </div>
                    </ProtectedRoute>
                  }   
                /> */}
                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </StockProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
