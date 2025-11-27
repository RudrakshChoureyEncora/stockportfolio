// Step3InvestmentProfile.jsx

import { useRUContext } from "../../context/RegisterUserContext";

const Step3InvestmentProfile = () => {
  const { investmentProfile, updateInvestmentProfile, errors } = useRUContext();

  const handleChange = (field, value) => {
    updateInvestmentProfile({ [field]: value });
  };

  return (
    <div className="form-step">
      <h2>Investment Profile</h2>
      <p className="step-description">
        Please provide your investment preferences and experience.
      </p>

      {/* Risk Appetite */}
      <div className="form-group">
        <label htmlFor="riskAppetite">Risk Appetite *</label>
        <select
          id="riskAppetite"
          value={investmentProfile.riskAppetite || ""}
          onChange={(e) => handleChange("riskAppetite", e.target.value)}
          className={errors.riskAppetite ? "error" : ""}
        >
          <option value="">Select risk appetite</option>
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>
        {errors.riskAppetite && (
          <span className="error-text">{errors.riskAppetite}</span>
        )}
      </div>

      {/* Experience Level */}
      <div className="form-group">
        <label htmlFor="experience">Experience Level *</label>
        <select
          id="experience"
          value={investmentProfile.experience || ""}
          onChange={(e) => handleChange("experience", e.target.value)}
          className={errors.experience ? "error" : ""}
        >
          <option value="">Select experience level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>
        {errors.experience && (
          <span className="error-text">{errors.experience}</span>
        )}
      </div>

      {/* Investment Goal */}
      <div className="form-group">
        <label htmlFor="investmentGoal">Investment Goal *</label>
        <input
          type="text"
          id="investmentGoal"
          placeholder="Describe your investment goal"
          value={investmentProfile.investmentGoal || ""}
          onChange={(e) => handleChange("investmentGoal", e.target.value)}
          className={errors.investmentGoal ? "error" : ""}
        />
        {errors.investmentGoal && (
          <span className="error-text">{errors.investmentGoal}</span>
        )}
      </div>
    </div>
  );
};

export default Step3InvestmentProfile;
