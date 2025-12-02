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
import OutputPage from "./components/OutputPage";
import StockDetails from "./components/stock/StockDetails";
import OrderStock from "./components/dashboard/OrderStock";
import News from "./News";
import Profile from "./components/Profile";
import ManageStocks from "./components/adminComponents/ManageStocks";
import ManageUser from "./components/adminComponents/ManageUser";

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
                  <Route path="/output" element={<OutputPage />} />
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
                      <ProtectedRoute requiredRole="USER">
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
                      <ProtectedRoute equiredRole="USER">
                        <OrderStock />
                      </ProtectedRoute>
                    }
                  />
                  {/* Admin route example (role-based) */}
                  <Route
                    path="/manageUsers"
                    element={
                      <ProtectedRoute requiredRole="ADMIN">
                        <ManageUser />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/manageStocks"
                    element={
                      <ProtectedRoute requiredRole="ADMIN">
                        <ManageStocks />
                      </ProtectedRoute>
                    }
                  />
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
