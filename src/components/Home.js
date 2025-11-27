// src/pages/Home.js
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import NewStockCard from "../components/dashboard/NewStockCard";
import { useStock } from "../context/StockCon";

const Home = () => {
  const { user } = useAuth();
  const { stocks, loading } = useStock();
  const [loadingLocalParam, setloadingLocalParam] = useState(true);
  console.log(stocks);
  // useEffect(() => {
  //   const fetchStocks = async () => {
  //     try {
  //       const raw = stocks;

  //       // Normalize property names
  //       const formatted = raw.map((item) => ({
  //         stockId: item.StockId,
  //         companyName: item.CompanyName,
  //         symbol: item.Symbol,
  //         currentPrice: item.CurrentPrice,
  //         history: item.history || [], // ensure array
  //       }));

  //       console.log("Stocks loaded:", formatted);
  //       setStocks(formatted);
  //     } catch (err) {
  //       console.error("❌ Error loading stocks:", err);
  //     } finally {
  //       setloadingLocalParam(false);
  //     }
  //   };

  //   fetchStocks();
  // }, []);
  return (
    <div className="home">
      <h1 className="title">📈 Live Stock Market Dashboard</h1>

      {/* USER SECTION */}
      {user ? (
        <p className="user-info">
          Logged in as <strong>{user.name}</strong>.{" "}
          <Link to="/dashboard" className="nav-link">
            Go to Dashboard →
          </Link>
        </p>
      ) : (
        <p className="user-info">
          Please <Link to="/login">Log-in</Link> or{" "}
          <Link to="/register">Register</Link>.
        </p>
      )}

      <h2 className="section-title">🔥 Available Stocks</h2>

      {/* LOADING */}
      {loading ? (
        <p>Loading stocks...</p>
      ) : stocks.length === 0 ? (
        <p>No stocks available.</p>
      ) : (
        <div className="stock-list">
          {stocks.map((stock) => (
            <NewStockCard key={stock.stockId} stock={stock} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
