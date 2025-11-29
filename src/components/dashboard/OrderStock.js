import { useLocation, useNavigate } from "react-router-dom";
import { useStock } from "../../context/StockCon";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/OrderStock.css";

export default function OrderStock() {
  const { stocks } = useStock();
  const { user, orderAction } = useAuth();
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const defaultStockId = params.get("watch");
  const defaultAction = params.get("action") || "buy";

  const [selectedStockId, setSelectedStockId] = useState(defaultStockId);
  const [action, setAction] = useState(defaultAction);
  const [quantity, setQuantity] = useState(1);

  const [useCurrentPrice, setUseCurrentPrice] = useState(false);

  const selectedStock = stocks.find((s) => s.StockId === selectedStockId);
  const navigate = useNavigate();
  const location = useLocation();
  const [price, setPrice] = useState(selectedStock.CurrentPrice);

  useEffect(() => {
    if (useCurrentPrice) {
      setPrice(selectedStock.CurrentPrice);
    }
  }, [useCurrentPrice]);

  // Calculate total value
  const totalValue = quantity * price;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quantityToSend = action === "sell" ? -quantity : quantity;

    const result = await orderAction(
      user.userId,
      selectedStockId,
      parseInt(quantityToSend),
      parseFloat(price)
    );

    if (result.success) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } else {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="order-stock">
      <div className="order-stock-content">
        <h2>
          {action === "buy" ? "Buy" : "Sell"} {selectedStockId}
        </h2>

        {selectedStock && (
          <div className="stock-details">
            <strong>Stock Details:</strong>
            <p>Name: {selectedStock.name}</p>
            <p>Symbol: {selectedStock.symbol}</p>
            <p>Current Price: ₹{selectedStock.CurrentPrice}</p>
            <p>Quantity: {quantity}</p>
            <p>Total Value: ₹{totalValue.toFixed(2)}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="order-form">
          <label>
            Select Stock:
            <select
              value={selectedStockId}
              onChange={(e) => {
                setSelectedStockId(e.target.value);
                setUseCurrentPrice(false);
                setPrice("");
              }}
            >
              {stocks.map((s) => (
                <option key={s.StockId} value={s.StockId}>
                  {s.StockId} — {s.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Action:
            <select value={action} onChange={(e) => setAction(e.target.value)}>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </label>

          <label>
            Quantity:
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </label>

          <label>
            Price:
            <input
              type="number"
              value={price}
              // disabled={useCurrentPrice}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>

          <label>
            <input
              type="checkbox"
              checked={useCurrentPrice}
              onChange={(e) => setUseCurrentPrice(e.target.checked)}
            />
            Use Current Price (₹{selectedStock?.CurrentPrice})
          </label>

          <button type="submit">Submit Order</button>
        </form>
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
      </div>
    </div>
  );
}
