import { useRUContext } from "../../context/RegisterUserContext";

const Step1pers = () => {
  const { personalInfo, updatePersonalInfo, errors } = useRUContext();

  const handleChange = (field, value) => {
    updatePersonalInfo({ [field]: value });
  };

  const handlePhoneChange = (value) => {
    // Auto-format phone number
    const numbers = value.replace(/\D/g, "");
    let formatted = numbers;

    if (numbers.length > 3 && numbers.length <= 6) {
      formatted = `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else if (numbers.length > 6) {
      formatted = `(${numbers.slice(0, 3)}) ${numbers.slice(
        3,
        6
      )}-${numbers.slice(6, 10)}`;
    }

    updatePersonalInfo({ phone: formatted });
  };

  return (
    <div className="form-step">
      <h2>Personal Information</h2>
      <p className="step-description">
        Please provide your basic personal details.
      </p>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            id="firstName"
            type="text"
            value={personalInfo.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className={errors.firstName ? "error" : ""}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <span className="error-text">{errors.firstName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            id="lastName"
            type="text"
            value={personalInfo.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className={errors.lastName ? "error" : ""}
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <span className="error-text">{errors.lastName}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone Number *</label>
        <input
          id="phone"
          type="tel"
          value={personalInfo.phone || ""}
          onChange={(e) => handlePhoneChange(e.target.value)}
          className={errors.phone ? "error" : ""}
          placeholder="(555) 123-4567"
          maxLength="14"
        />
        {errors.phone && <span className="error-text">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="dateOfBirth">Date of Birth *</label>
        <input
          id="dateOfBirth"
          type="date"
          value={personalInfo.dateOfBirth || ""}
          onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          className={errors.dateOfBirth ? "error" : ""}
          max={new Date().toISOString().split("T")[0]}
        />
        {errors.dateOfBirth && (
          <span className="error-text">{errors.dateOfBirth}</span>
        )}
      </div>
    </div>
  );
};
export default Step1pers;
