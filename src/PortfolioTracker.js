// src/PortfolioTracker.js
import React from "react";
import PortfolioSummary from "./components/dashboard/PortfolioSummary";
import AddStockForm from "./components/dashboard/AddStockForm";
import StockCard from "./components/dashboard/StockCard";
import PriceChart from "./components/dashboard/PriceChart";
import "./PortfolioTracker.css";
import { useStock } from "./context/StockCon";
const PortfolioTracker = () => {
  const { stocks } = useStock();
  // console.log(stocks);
  console.log("this is getting printed");
  return (
    <div className="portfolio-tracker">
      <div className="portfolio-layout">
        <div className="main-content">
          {/* <PortfolioSummary /> */}
          {/* <div className="stocks-section">
            <h2>Your Stocks ({stocks.length})</h2>
            {stocks.length === 0 ? (
              <div className="empty-portfolio">
                <div className="empty-icon"> </div>
                <h3>Your portfolio is empty</h3>
                <p>Add your first stock to start tracking!</p>
              </div>
            ) : (
              <div className="stocks-grid">
                {stocks.map((stock) => (
                  <StockCard key={stock.symbol} stock={stock} />
                ))}
              </div>
            )}
          </div> */}
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
