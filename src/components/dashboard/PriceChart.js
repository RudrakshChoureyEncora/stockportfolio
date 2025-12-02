import React, { useEffect, useState } from "react";
import { useStock } from "../../context/StockCon";
import { useNavigate } from "react-router-dom";
import "../../styles/Pricechart.css";
const PriceChart = () => {
  const { stocks } = useStock();
  const [selectedStock, setSelectedStock] = useState(null);
  const navigate = useNavigate();

  // Move useEffect to the top, before any conditional returns
  useEffect(() => {
    // console.log("this is getting called");
    // console.log(selectedStock);
    // console.log(stocks);
    if (stocks.length > 0 && selectedStock) {
      const foundStock = stocks.find(
        (s) => s.StockId === selectedStock.StockId
      );
      if (foundStock) {
        // console.log(foundStock);
        // console.log(stocks);
        setSelectedStock(foundStock);
      }
    }
  }, [stocks]);

  if (stocks.length === 0) {
    return (
      <div className="price-chart empty">
        <h3>Price History</h3>
        <p>No stocks in portfolio to display chart.</p>
      </div>
    );
  }

  const displayStock = selectedStock || stocks[0];
  const history = displayStock.history || [];

  if (history.length < 2) {
    return (
      <div className="price-chart">
        <div className="chart-header">
          <h3>Price History</h3>
          <select
            value={displayStock.symbol}
            onChange={(e) =>
              setSelectedStock(stocks.find((s) => s.symbol === e.target.value))
            }
          >
            {stocks.map((stock) => (
              <option key={stock.symbol} value={stock.symbol}>
                {stock.symbol} - {stock.name}
              </option>
            ))}
          </select>
        </div>
        <p>Collecting price data for {displayStock.symbol}...</p>
      </div>
    );
  }
  const handleBuy = () => {
    navigate(`/orderStock?watch=${displayStock.StockId}&action=buy`);
  };

  const handleSell = () => {
    navigate(`/orderStock?watch=${displayStock.StockId}&action=sell`);
  };

  const prices = history.map((point) => point.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const chartHeight = 200;
  const chartWidth = 400;

  const getX = (index) => (index / (history.length - 1)) * chartWidth;
  const getY = (price) =>
    chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * chartHeight;

  const pathData = history
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${getX(index)} ${getY(point.price)}`
    )
    .join(" ");

  const CurrentPrice = displayStock.CurrentPrice;
  const initialPrice = history[0].price;
  const priceChange = CurrentPrice - initialPrice;
  const percentChange = (priceChange / initialPrice) * 100;

  return (
    <div className="price-chart">
      <div className="chart-header">
        <div className="chart-title">
          <h3>{displayStock.symbol} Price History</h3>
          <div
            className={`price-change ${
              priceChange >= 0 ? "positive" : "negative"
            }`}
          >
            {priceChange >= 0 ? "↗" : "↘"} ₹{Math.abs(priceChange).toFixed(2)} (
            {percentChange >= 0 ? "+" : ""}
            {percentChange.toFixed(2)}%)
          </div>
        </div>
        <select
          value={displayStock.symbol}
          onChange={(e) =>
            setSelectedStock(stocks.find((s) => s.symbol === e.target.value))
          }
        >
          {stocks.map((stock) => (
            <option key={stock.symbol} value={stock.symbol}>
              {stock.symbol} - {stock.name}
            </option>
          ))}
        </select>
      </div>
      <div className="chart-container">
        <svg width={chartWidth} height={chartHeight} className="chart-svg">
          <line x1="0" y1="0" x2="0" y2={chartHeight} stroke="#e0e0e0" />
          <line
            x1="0"
            y1={chartHeight}
            x2={chartWidth}
            y2={chartHeight}
            stroke="#e0e0e0"
          />
          <path d={pathData} stroke="#007bff" strokeWidth="2" fill="none" />
          <circle
            cx={getX(0)}
            cy={getY(history[0].price)}
            r="3"
            fill="#28a745"
          />
          <circle
            cx={getX(history.length - 1)}
            cy={getY(CurrentPrice)}
            r="3"
            fill="#dc3545"
          />
        </svg>
      </div>
      <div className="chart-info">
        <div className="info-item">
          <span className="label">Current Price:</span>
          <span className="value">₹{CurrentPrice.toFixed(2)}</span>
        </div>
        <div className="info-item">
          <span className="label">Initial Price:</span>
          <span className="value">₹{initialPrice.toFixed(2)}</span>
        </div>
        <div className="info-item">
          <span className="label">Price Range:</span>
          <span className="value">
            ₹{minPrice.toFixed(2)} - ₹{maxPrice.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="actions">
        <button onClick={handleBuy} className="buy-button">
          Buy
        </button>
        <button onClick={handleSell} className="sell-button">
          Sell
        </button>
      </div>
    </div>
  );
};

export default PriceChart;
