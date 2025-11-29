import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/auth/Login";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoutes";
import Register from "./components/auth/Register";
import { RUProvider } from "./context/RegisterUserContext";
import { StockProvider } from "./context/StockCon";
import PortfolioTracker from "../src/components/PortfolioTracker";
import Home from "./components/Home";
import StockDetails from "./components/stock/StockDetails";
import OrderStock from "./components/dashboard/OrderStock";
import News from "./News";
import Profile from "./components/Profile";

// Profile component (example of another protected route)

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
                  <Route path="/news" element={<News />} />
                  <Route path="/stock/:StockId" element={<StockDetails />} />
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
