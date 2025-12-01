// src/components/PortfolioSummary.js
import React from "react";
import { useStock } from "../../context/StockCon";
import { useAuth } from "../../context/AuthContext";
import { calculatePortfolioSummary } from "../../services/PortfolioCalculator";
import "../../styles/PortfolioSummary.css";

const PortfolioSummary = () => {
  const { userStocks } = useAuth();
  const { stocks } = useStock();
  const {
    totalValue,
    totalInvested,
    absoluteReturn,
    totalReturn,
    stocksCount,
    topPerformer,
  } = calculatePortfolioSummary(userStocks, stocks);

  if (userStocks.length === 0) {
    return (
      <div className="portfolio-summary empty">
        <h2>Portfolio Summary</h2>
        <p>Add stocks to your portfolio to see summary information.</p>
      </div>
    );
  }

  return (
    <div className="portfolio-summary">
      <div className="summary-header">
        <h2>Portfolio Summary</h2>
      </div>
      <div className="summary-grid">
        <div className="summary-card total-value">
          <h3>Total Value</h3>
          <div className="amount">${totalValue.toFixed(2)}</div>
          <div className="label">Current Portfolio Value Currently</div>
        </div>
        <div className="summary-card total-invested">
          <h3>Total Invested Currently</h3>
          <div className="amount">${totalInvested.toFixed(2)}</div>
          <div className="label">Total Amount Invested Currently</div>
        </div>
        <div
          className={`summary-card returns ${
            absoluteReturn >= 0 ? "positive" : "negative"
          }`}
        >
          <h3>Total Return</h3>
          <div className="amount">
            {absoluteReturn >= 0 ? "+" : ""}${absoluteReturn.toFixed(2)}
          </div>
          <div className="percentage">
            ({totalReturn >= 0 ? "+" : ""}
            {totalReturn.toFixed(2)}%)
          </div>
        </div>
        <div className="summary-card stocks-count">
          <h3>Stocks Held Currently</h3>
          <div className="amount">{stocksCount}</div>
          <div className="label">Different Stocks</div>
        </div>
      </div>
      {topPerformer && topPerformer.return > -Infinity && (
        <div className="performance-highlight">
          <span className="highlight-label">Top Performer:</span>
          <span className="highlight-stock">{topPerformer.symbol}</span>
          <span
            className={`highlight-return ${
              topPerformer.return >= 0 ? "positive" : "negative"
            }`}
          >
            {topPerformer.return >= 0 ? "+" : ""}
            {topPerformer.return.toFixed(2)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default PortfolioSummary;
