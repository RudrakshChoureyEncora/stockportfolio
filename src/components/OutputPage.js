import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/OutputPages.css";

const OutputPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location || {};

  return (
    <div className="output-container">
      <p
        className={`output-message ${
          state?.success ? "output-success" : "output-error"
        }`}
      >
        {state?.success
          ? `Success: ${state.data}`
          : `Error: ${state?.error || "Unknown error"}`}
      </p>

      <div className="output-buttons">
        <button className="go-back" onClick={() => navigate(-1)}>
          Go Back
        </button>
        <button className="go-home" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default OutputPage;
