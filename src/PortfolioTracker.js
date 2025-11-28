// src/PortfolioTracker.js
import React from "react";
import PortfolioSummary from "./components/dashboard/PortfolioSummary";
import AddStockForm from "./components/dashboard/AddStockForm";
import StockCard from "./components/dashboard/StockCard";
import PriceChart from "./components/dashboard/PriceChart";
import "./PortfolioTracker.css";
import { useStock } from "./context/StockCon";
import { useAuth } from "./context/AuthContext";
const PortfolioTracker = () => {
  const { user, userStocks, logout, isTokenExpiringSoon } = useAuth();
  // const { stocks } = useStock();
  // console.log("this are user Stocks");
  // console.log(user);
  // console.log(userStocks);
  // // console.log(stocks);
  // console.log("this is getting printed");
  return (
    <div className="portfolio-tracker">
      <div className="portfolio-layout">
        {/* <h1>{JSON.stringify(user)}</h1> */}

        <div className="main-content">
          {/* <PortfolioSummary /> */}
          <div className="stocks-section">
            <h2>Your Stocks ({userStocks.length})</h2>
            {userStocks.length === 0 ? (
              <div className="empty-portfolio">
                <div className="empty-icon"> </div>
                <h3>Your portfolio is empty</h3>
                <p>Add your first stock to start tracking!</p>
              </div>
            ) : (
              <div className="stocks-grid">
                {userStocks.map((stock) => (
                  <StockCard key={stock.stockId} stock={stock} />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="sidebar">
          {/* <AddStockForm /> */}
          {/* <PriceChart /> */}
        </div>
      </div>
    </div>
  );
};
export default PortfolioTracker;
