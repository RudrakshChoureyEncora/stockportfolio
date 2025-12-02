// src/components/AddStockForm.js
import React, { useState } from "react";
import "../../styles/AddStockForm.css";
import { useStock } from "../../context/StockCon";
import { useNavigate } from "react-router-dom";

const AddStockForm = ({ existingStocks }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    currentPrice: "",
    symbol: "",
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const { addStock } = useStock();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };
  if (!Array.isArray(existingStocks)) existingStocks = [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // Check if companyName or symbol already exists (with safe access)
    if (
      formData.companyName &&
      existingStocks.some(
        (stock) =>
          stock.companyName &&
          stock.companyName.toLowerCase() === formData.companyName.toLowerCase()
      )
    ) {
      newErrors.companyName = "Company name already exists";
    }

    if (
      formData.symbol &&
      existingStocks.some(
        (stock) =>
          stock.symbol &&
          stock.symbol.toLowerCase() === formData.symbol.toLowerCase()
      )
    ) {
      newErrors.symbol = "Symbol already exists";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await addStock(
      formData.companyName,
      formData.symbol,
      formData.currentPrice
    );

    if (result.success) {
      navigate("/output", { state: result });
    } else {
      navigate("/output", { state: result });
    }

    console.log(JSON.stringify(formData, null, 2));
  };

  return (
    <form onSubmit={handleSubmit} className="add-stock-form">
      <h3>Add Stock</h3>
      <div className="form-group">
        <label>Company Name</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className={errors.companyName ? "error" : ""}
        />
        {errors.companyName && (
          <span className="error-message">{errors.companyName}</span>
        )}
      </div>
      <div className="form-group">
        <label>Current Price</label>
        <input
          type="number"
          name="currentPrice"
          value={formData.currentPrice}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Symbol</label>
        <input
          type="text"
          name="symbol"
          value={formData.symbol}
          onChange={handleChange}
          className={errors.symbol ? "error" : ""}
        />
        {errors.symbol && (
          <span className="error-message">{errors.symbol}</span>
        )}
      </div>
      <button type="submit">Add Stock</button>
    </form>
  );
};

export default AddStockForm;
