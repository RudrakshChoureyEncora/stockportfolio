import { useRUContext } from "../../context/RegisterUserContext";
import ProgressBar from "../registration/ProgressBar";

import Step4Review from "../registration/Step4PortfolioReview";
import FormNavigation from "../registration/FormNavigation";
import Step1pers from "../registration/Step1pers";
import Step2Account from "../registration/Step2Account";
import Step3InvestmentProfile from "../registration/Step3InvestmentProfile";
import Step4PReview from "../registration/Step4PortfolioReview";
import "../../styles/Register.css";

export default function Register() {
  //   return <h1>this is register page form tag</h1>;WWWW
  const { currentStep, isSubmitted } = useRUContext();

  const renderCurrentStep = () => {
    if (isSubmitted) {
      return <Step4Review />;
    }

    switch (currentStep) {
      case 1:
        return <Step1pers />;
      case 2:
        return <Step2Account />;
      case 3:
        return <Step3InvestmentProfile />;
      case 4:
        return <Step4PReview />;
      default:
        return <Step1pers />;
    }
  };
  return (
    <div className="multi-step-form">
      <div className="form-container">
        <header className="form-header">
          <h1>Multi-Step Registration</h1>
          <p>Complete your registration in a few simple steps</p>
        </header>
        {!isSubmitted && <ProgressBar />}
        <div className="form-content">{renderCurrentStep()}</div>{" "}
        {!isSubmitted && <FormNavigation />}
        <footer className="form-footer">
          <p>
            <strong>Auto-save enabled:</strong> Your progress is automatically
            You can return anytime to complete your registration.
          </p>
        </footer>
      </div>
    </div>
  );
}
