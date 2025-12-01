import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NewStockCard from "../../components/dashboard/NewStockCard";
import { useStock } from "../../context/StockCon";
import { useAuth } from "../../context/AuthContext";
import "../../styles/ManageStocks.css";
import AddStockForm from "./AddStockForm";
import ModifyStockForm from "./ModifyStockForm";

const ManageStocks = () => {
  const { stocks, loading, removeStock, updateStock } = useStock();
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);

  const handleDelete = async (stockID) => {
    const result = await removeStock(stockID);
    if (result.success) {
      console.log("Stock deleted successfully");
    } else {
      console.log("Delete failed:", result.error);
    }
  };

  const handleModify = (stock) => {
    setSelectedStock(stock);
    setShowAddForm(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleBackToAdd = () => {
    setSelectedStock(null);
    setShowAddForm(true);
  };

  return (
    <div className="manage-stocks">
      <div className="manage-stocks-layout">
        <div className="stocks-content">
          <h2 className="title">
            Hello Admin {user.firstName}, Manage Stocks Here
          </h2>
          <h4 className="section-title">Available Stocks</h4>
          {loading ? (
            <p>Loading stocks...</p>
          ) : stocks.length === 0 ? (
            <p>No stocks available.</p>
          ) : (
            <div className="stock-list">
              {stocks.map((stock) => (
                <div key={stock.StockId} className="stock-card">
                  <NewStockCard stock={stock} />
                  <button
                    onClick={() => handleModify(stock)}
                    className="details-button"
                  >
                    Modify
                  </button>
                  <button
                    onClick={() => handleDelete(stock.StockId)}
                    className="details-button"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="stocks-sidebar">
          {showAddForm ? (
            <AddStockForm />
          ) : (
            <ModifyStockForm stock={selectedStock} onBack={handleBackToAdd} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageStocks;
