import React, { useState } from "react";
import "../../styles/ModifyStockForm.css";
import { useStock } from "../../context/StockCon";
const ModifyStockForm = ({ stock, onBack }) => {
  const [symbol, setSymbol] = useState(stock.symbol);
  const [name, setName] = useState(stock.name);
  const { updateStock } = useStock();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare updated stock object
    const stockToUpdate = {
      stockId: stock.StockId,
      companyName: name,
      symbol: symbol,
    };

    // Call onUpdate with the updated stock
    const result = await updateStock(stockToUpdate);

    if (result.success) {
      console.log("Added!", result.data);
    } else {
      console.log("Failed:", result.error);
    }
  };

  return (
    <div className="modify-stock-form">
      <h3>Modify Stock</h3>
      <p>Modify details for: {stock.StockId}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Stock ID:</label>
          <input type="text" value={stock.StockId} disabled />
        </div>
        <div>
          <label>Symbol:</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Current Price:</label>
          <input type="text" value={stock.CurrentPrice} disabled />
        </div>

        <button type="submit" className="submit-button">
          Update Stock
        </button>
        <button type="button" onClick={onBack} className="back-button">
          Go Back
        </button>
      </form>
    </div>
  );
};

export default ModifyStockForm;
