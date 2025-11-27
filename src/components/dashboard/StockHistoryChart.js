import React, { useMemo } from "react";

const StockHistoryChart = ({ history = [], range }) => {
  // Ensure history is always an array
  const safeHistory = history || [];

  // Slice last N points based on range
  const data = useMemo(() => {
    const pointsCount = range; // 10, 20, 30
    return safeHistory.slice(-pointsCount);
  }, [safeHistory, range]);

  if (data.length === 0) {
    return <div className="chart-placeholder">No history available</div>;
  }

  const prices = data.map((d) => d.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  const chartWidth = 300;
  const chartHeight = 100;

  const getY = (price) =>
    chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * chartHeight;

  const getX = (index) => (index / (data.length - 1)) * chartWidth;

  const pathData = data
    .map(
      (point, idx) =>
        `${idx === 0 ? "M" : "L"} ${getX(idx)} ${getY(point.price)}`
    )
    .join(" ");

  return (
    <div className="line-chart">
      <svg width={chartWidth} height={chartHeight}>
        {/* Axes */}
        <line
          x1="0"
          y1={chartHeight}
          x2={chartWidth}
          y2={chartHeight}
          stroke="#ccc"
        />
        <line x1="0" y1="0" x2="0" y2={chartHeight} stroke="#ccc" />

        {/* Price line */}
        <path d={pathData} fill="none" stroke="#007bff" strokeWidth="2" />

        {/* Points */}
        {data.map((point, idx) => (
          <circle
            key={idx}
            cx={getX(idx)}
            cy={getY(point.price)}
            r="2"
            fill="#007bff"
          />
        ))}
      </svg>

      <div className="chart-labels">
        <span>Min: {minPrice.toFixed(2)}</span>
        <span>Max: {maxPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default StockHistoryChart;
