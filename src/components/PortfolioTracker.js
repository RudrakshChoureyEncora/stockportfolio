// src/PortfolioTracker.js
import React from "react";
import PortfolioSummary from "./dashboard/PortfolioSummary";

import StockCard from "./dashboard/StockCard";
import PriceChart from "./dashboard/PriceChart";
import "../styles/PortfolioT.css";
import { useAuth } from "../context/AuthContext";
const PortfolioTracker = () => {
  const { user, userStocks } = useAuth();
  console.log("this is getting rendered");
  console.log(user);
  console.log(userStocks);
  // const { stocks } = useStock();
  // console.log("this are user Stocks");
  // console.log(user);
  // console.log(userStocks);
  // // console.log(stocks);
  // console.log("this is getting printed");
  return (
    <div className="portfolio-tracker">
      <div className="portfolio-layout">
        <div className="main-content">
          <PortfolioSummary />
          <div className="stocks-section">
            <h2>
              Your Stocks (
              {/* {userStocks.filter((stock) => stock.quantity > 0).length} */}
              {Array.isArray(userStocks) &&
                userStocks.filter((stock) => stock.quantity > 0).length}
              )
            </h2>
            {userStocks.length === 0 ? (
              <div className="empty-portfolio">
                <div className="empty-icon"> </div>
                <h3>Your portfolio is empty</h3>
                <p>Add your first stock to start tracking!</p>
              </div>
            ) : (
              <div className="stocks-grid">
                {/* {userStocks
                  .filter((stock) => stock.quantity > 0)
                  .map((stock) => (
                    <StockCard key={stock.stockId} stock={stock} />
                  ))} */}
                {Array.isArray(userStocks) &&
                  userStocks
                    .filter((stock) => stock.quantity > 0)
                    .map((stock) => (
                      <StockCard key={stock.stockId} stock={stock} />
                    ))}
              </div>
            )}
          </div>
        </div>
        <div className="sidebar">
          {/* <AddStockForm /> */}
          <PriceChart />
        </div>
      </div>
    </div>
  );
};
export default PortfolioTracker;
