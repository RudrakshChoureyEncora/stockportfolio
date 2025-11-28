import { useLocation } from "react-router-dom";
import { useStock } from "../../context/StockCon";
import { useState, useEffect } from "react";

export default function OrderStock() {
  const { stocks } = useStock();

  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const defaultStockId = params.get("watch");
  const defaultAction = params.get("action") || "buy";

  // Form States
  const [selectedStockId, setSelectedStockId] = useState(defaultStockId);
  const [action, setAction] = useState(defaultAction);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [useCurrentPrice, setUseCurrentPrice] = useState(false);

  // Find selected stock data
  const selectedStock = stocks.find((s) => s.stockId === selectedStockId);

  // Update price when "use current price" toggles OR stock changes
  useEffect(() => {
    if (useCurrentPrice && selectedStock) {
      setPrice(selectedStock.currentPrice);
    }
  }, [useCurrentPrice, selectedStock]);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Order placed:", {
      selectedStockId,
      action,
      quantity,
      price,
    });

    alert("Order Submitted!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>
        {action === "buy" ? "Buy" : "Sell"} {selectedStockId}
      </h2>

      {selectedStock && (
        <div style={{ marginBottom: "20px" }}>
          <strong>Stock Details:</strong>
          <p>Name: {selectedStock.name}</p>
          <p>Symbol: {selectedStock.symbol}</p>
          <p>Current Price: ₹{selectedStock.currentPrice}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
        {/* Stock Selection - SINGLE DROPDOWN */}
        <label>
          Select Stock:
          <select
            value={selectedStockId}
            onChange={(e) => {
              setSelectedStockId(e.target.value);
              setUseCurrentPrice(false); // reset price mode when switching stock
              setPrice(""); // clear price to avoid mismatch
            }}
            style={{ width: "250px" }}
          >
            {stocks.map((s) => (
              <option key={s.stockId} value={s.stockId}>
                {s.stockId} — {s.name}
              </option>
            ))}
          </select>
        </label>

        {/* Action Select */}
        <label>
          Action:
          <select value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </label>

        {/* Quantity Input */}
        <label>
          Quantity:
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ width: "100px" }}
          />
        </label>

        {/* Price Input */}
        <label>
          Price:
          <input
            type="number"
            value={price}
            disabled={useCurrentPrice}
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: "150px" }}
          />
        </label>

        {/* Checkbox: Use Current Price */}
        <label>
          <input
            type="checkbox"
            checked={useCurrentPrice}
            onChange={(e) => setUseCurrentPrice(e.target.checked)}
          />
          Use Current Price (₹{selectedStock?.currentPrice})
        </label>

        {/* Submit Button */}
        <button type="submit" style={{ width: "150px", marginTop: "10px" }}>
          Submit Order
        </button>
      </form>
    </div>
  );
}
