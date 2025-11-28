import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStock } from "../../context/StockCon";
import StockHistoryChart from "../../components/dashboard/StockHistoryChart";
import "../../styles/StockDetails.css";

const StockDetails = () => {
  const { stockId } = useParams();
  const navigate = useNavigate();
  const { stocks, addToWatchlist } = useStock();
  const stock = stocks.find((s) => s.stockId === stockId);

  if (!stock) {
    return <p>Stock not found</p>;
  }

  const history = stock.history || [];
  const initialPrice =
    history.length > 0 ? history[0].price : stock.currentPrice;
  const priceChange = stock.currentPrice - initialPrice;
  const percentChange =
    history.length > 0 ? ((priceChange / initialPrice) * 100).toFixed(2) : 0;
  const dayChange =
    history.length > 1
      ? ((stock.currentPrice - history[history.length - 2]?.price) /
          history[history.length - 2]?.price) *
        100
      : 0;

  const handleBuy = () => {
    navigate(`/orderStock?watch=${stock.stockId}&action=buy`);
  };

  const handleSell = () => {
    navigate(`/orderStock?watch=${stock.stockId}&action=sell`);
  };

  const handleAddToWatchlist = () => {
    navigate(`/dashboard?watch=${stock.stockId}`);
    alert(`${stock.symbol} added to watchlist`);
  };

  // Generate candles for the last 10 points
  const generateCandles = (data) => {
    const candles = [];
    for (let i = 0; i < data.length; i += 2) {
      const period = data.slice(i, i + 2);
      if (period.length === 2) {
        const prices = period.map((p) => p.price);
        candles.push({
          open: period[0].price,
          high: Math.max(...prices),
          low: Math.min(...prices),
          close: period[1].price,
        });
      }
    }
    return candles;
  };

  const candles = generateCandles(history.slice(-10));

  return (
    <div className="stock-details">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>
      <h2>
        {stock.name} ({stock.symbol})
      </h2>
      <p>
        <strong>Stock ID:</strong> {stock.stockId}
      </p>
      <p>
        <strong>Current Price:</strong> ₹{stock.currentPrice}
      </p>
      <p>
        <strong>Initial Price:</strong> ₹{initialPrice}
      </p>
      <p>
        <strong>Price Change:</strong> ₹{priceChange.toFixed(2)} (
        {percentChange}% change)
      </p>
      <p>
        <strong>Day Change:</strong> {dayChange >= 0 ? "↗" : "↘"}{" "}
        {Math.abs(dayChange).toFixed(2)}%
      </p>

      <div className="stock-chart">
        <StockHistoryChart history={history} range={60} />
      </div>

      <div className="candlestick-mini-chart">
        {candles.map((candle, index) => (
          <div key={index} className="candlestick">
            <div
              className="wick wick-top"
              style={{
                height: `${
                  ((candle.high - Math.max(candle.open, candle.close)) /
                    (candle.high - candle.low)) *
                  20
                }px`,
                top: 0,
              }}
            ></div>
            <div
              className="body"
              style={{
                height: `${
                  (Math.abs(candle.close - candle.open) /
                    (candle.high - candle.low)) *
                  20
                }px`,
                backgroundColor:
                  candle.close >= candle.open ? "#28a745" : "#dc3545",
                top: `${
                  ((Math.min(candle.open, candle.close) - candle.low) /
                    (candle.high - candle.low)) *
                  20
                }px`,
              }}
            ></div>
            <div
              className="wick wick-bottom"
              style={{
                height: `${
                  ((Math.min(candle.open, candle.close) - candle.low) /
                    (candle.high - candle.low)) *
                  20
                }px`,
                top: `${
                  (Math.abs(candle.close - candle.open) /
                    (candle.high - candle.low)) *
                  20
                }px`,
              }}
            ></div>
          </div>
        ))}
      </div>

      <div className="actions">
        <button onClick={handleBuy} className="buy-button">
          Buy
        </button>
        <button onClick={handleSell} className="sell-button">
          Sell
        </button>
        <button onClick={handleAddToWatchlist} className="watchlist-button">
          Add to Watchlist
        </button>
      </div>
    </div>
  );
};

export default StockDetails;
