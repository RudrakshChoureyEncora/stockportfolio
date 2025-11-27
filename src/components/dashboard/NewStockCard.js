// src/components/StockCard.js
import React, { useState, useMemo } from "react";
import StockHistoryChart from "./StockHistoryChart";

const NewStockCard = ({ stock }) => {
  const [range, setRange] = useState(10);
  console.log("Stock data:", stock);
  console.log("History data:", stock.history);

  // Normalize history so chart doesn't break
  const safeHistory = useMemo(() => {
    if (!Array.isArray(stock.history)) return [];

    return stock.history
      .map((h) => ({
        price: Number(h.price) || 0,
        timestamp: h.timestamp || h.timeStamp || null,
      }))
      .filter((h) => h.timestamp !== null); // remove invalid points
  }, [stock.history]);

  return (
    <div className="stock-card">
      <div className="stock-header">
        <h3>{stock.symbol}</h3>
        <p className="company">{stock.companyName}</p>
      </div>

      <div className="stock-price">
        <span className="price">₹{stock.currentPrice}</span>
      </div>

      {/* Chart */}
      <StockHistoryChart history={safeHistory} range={range} />

      {/* Range Selector */}
      <div className="range-selector">
        {[10, 20, 30].map((min) => (
          <button
            key={min}
            className={range === min ? "active" : ""}
            onClick={() => setRange(min)}
          >
            {min} min
          </button>
        ))}
      </div>

      <a className="details-button" href={`/stock/${stock.stockId}`}>
        View Details →
      </a>
    </div>
  );
};

export default NewStockCard;
