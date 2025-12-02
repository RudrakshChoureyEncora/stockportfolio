// src/components/UserFormNavigation.js
import React from "react";
import { useRUContext } from "../../context/RegisterUserContext";

const UserFormNavigation = () => {
  const {
    currentStep,
    prevStep,
    nextStep,
    validateCurrentStep,
    register,
    reset,
    isSubmitted,
  } = useRUContext();

  const handleNext = () => {
    if (validateCurrentStep()) {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    const success = await register();
  };

  const handleReset = () => {
    reset();
  };

  if (isSubmitted) {
    return (
      <div className="form-navigation">
        <button type="button" onClick={reset} className="btn btn-primary">
          Start New Registration
        </button>
      </div>
    );
  }

  return (
    <div className="form-navigation">
      <div className="nav-left">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="btn btn-secondary"
          >
            ← Previous
          </button>
        )}

        <button type="button" onClick={handleReset} className="btn btn-text">
          Reset Form
        </button>
      </div>

      <div className="nav-right">
        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="btn btn-primary"
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-success"
          >
            Complete Registration
          </button>
        )}
      </div>
    </div>
  );
};

export default UserFormNavigation;
