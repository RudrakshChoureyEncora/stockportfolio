import React from "react";
import { useStock } from "../../context/StockCon";
import "../../styles/Stockcard.css";
const StockCard = ({ stock }) => {
  const { stocks } = useStock();
  // console.log("this is stock card");
  // console.log(stocks);
  // console.log(stock);
  const userStock = stocks.find((s) => s.StockId === stock.stockId);
  if (!userStock) {
    return <div>No holdings found for {stock.symbol}</div>;
  }

  const CurrentPrice = userStock.CurrentPrice || 0;
  const value = CurrentPrice * (stock.quantity || 0);
  const investedAmount = stock.investedAmount || 0;

  const dayChange =
    stock.history && stock.history.length > 1
      ? ((CurrentPrice -
          (stock.history[stock.history.length - 2]?.price || 0)) /
          (stock.history[stock.history.length - 2]?.price || 1)) *
        100
      : 0;

  const profitPercent =
    investedAmount > 0 ? ((value - investedAmount) / investedAmount) * 100 : 0;

  const last10Prices = userStock.history
    .slice(-10)
    .map((point) => point.price || 0);

  return (
    <div className="stock-card">
      <div className="stock-header">
        <div className="stock-info">
          <h3>{userStock.symbol}</h3>
          <p className="stock-name">{userStock.name}</p>
        </div>
      </div>
      <div className="stock-details">
        <div className="price-section">
          <div className="current-price">₹{CurrentPrice.toFixed(2)}</div>
          <div
            className={`change ₹{profitPercent >= 0 ? "positive" : "negative"}`}
          >
            {profitPercent >= 0 ? "↗" : "↘"}{" "}
            {Math.abs(profitPercent).toFixed(2)}%
          </div>
        </div>
        <div className="shares-section">
          <span>{stock.quantity || 0} shares</span>
        </div>
        <div className="value-section">
          <div className="stock-value">₹{value.toFixed(2)}</div>
          <div className="value-label">Total Value</div>
        </div>
        <div className="invested-section">
          <div className="invested-amount">
            Invested: ₹{investedAmount.toFixed(2)}
          </div>
          <div className="purchase-date">Purchased: {stock.purchaseDate}</div>
        </div>
      </div>
      {/* {userStock.history && userStock.history.length > 1 && (
        <div className="mini-chart">
          <svg
            className="line-chart"
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
          >
            <polyline
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              points={last10Prices
                .map((price, index) => {
                  const x = (index / (last10Prices.length - 1)) * 100;
                  const y =
                    20 -
                    ((price - Math.min(...last10Prices)) /
                      (Math.max(...last10Prices) - Math.min(...last10Prices))) *
                      20;
                  return `₹{x},₹{y}`;
                })
                .join(" ")}
            />
          </svg>
        </div>
      )} */}
    </div>
  );
};

export default StockCard;
