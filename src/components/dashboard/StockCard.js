import React from "react";
import { useStock } from "../../context/StockCon";

const StockCard = ({ stock }) => {
  const { stocks } = useStock();
  const userStock = stocks.find((s) => s.stockId === stock.stockId);
  console.log(stock);
  console.log(userStock);
  if (!userStock) {
    return <div>No holdings found for {stock.symbol}</div>;
  }

  const currentPrice = userStock.currentPrice || 0;
  const value = currentPrice * (stock.quantity || 0);
  const investedAmount = stock.investedAmount || 0;

  const dayChange =
    stock.history && stock.history.length > 1
      ? ((currentPrice -
          (stock.history[stock.history.length - 2]?.price || 0)) /
          (stock.history[stock.history.length - 2]?.price || 1)) *
        100
      : 0;

  const profitPercent =
    investedAmount > 0 ? ((value - investedAmount) / investedAmount) * 100 : 0;

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
          <div className="current-price">${currentPrice.toFixed(2)}</div>
          <div
            className={`change ${profitPercent >= 0 ? "positive" : "negative"}`}
          >
            {profitPercent >= 0 ? "↗" : "↘"}{" "}
            {Math.abs(profitPercent).toFixed(2)}%
          </div>
        </div>
        <div className="shares-section">
          <span>{stock.quantity || 0} shares</span>
        </div>
        <div className="value-section">
          <div className="stock-value">${value.toFixed(2)}</div>
          <div className="value-label">Total Value</div>
        </div>
        <div className="invested-section">
          <div className="invested-amount">
            Invested: ${investedAmount.toFixed(2)}
          </div>
          <div className="purchase-date">Purchased: {stock.purchaseDate}</div>
        </div>
      </div>
      {userStock.history && userStock.history.length > 1 && (
        <div className="mini-chart">
          {userStock.history.slice(-10).map((point, index) => {
            const maxPrice = Math.max(
              ...userStock.history.slice(-10).map((p) => p.price || 0)
            );
            const minPrice = Math.min(
              ...userStock.history.slice(-10).map((p) => p.price || 0)
            );
            const height =
              ((point.price - minPrice) / (maxPrice - minPrice)) * 30 || 0;

            return (
              <div
                key={index}
                className="chart-bar"
                style={{ height: `${height}px` }}
                title={`$${(point.price || 0).toFixed(2)}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StockCard;
