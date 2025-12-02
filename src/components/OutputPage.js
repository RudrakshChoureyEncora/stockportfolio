import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OutputPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // <-- get location from hook
  const { state } = location || {}; // <-- prevent destructuring undefined

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div>
      {state?.success ? (
        <p style={{ color: "green" }}>Success: {state.data}</p>
      ) : (
        <p style={{ color: "red" }}>Error: {state?.error || "Unknown error"}</p>
      )}

      <button onClick={handleGoBack}>Go Back</button>
      <button onClick={handleGoHome}>Go to Home</button>
    </div>
  );
};

export default OutputPage;
