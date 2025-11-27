// Step4Review.jsx

import { useRUContext } from "../../context/RegisterUserContext";

const Step4PReview = () => {
  const {
    personalInfo,
    userId,
    email,
    username,
    investmentProfile,
    isSubmitted,
  } = useRUContext();

  const formatPhone = (phone) => {
    if (!phone) return "Not provided";
    return phone;
  };

  const formatDate = (date) => {
    if (!date) return "Not provided";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isSubmitted) {
    return (
      <div className="form-step submitted">
        <div className="success-animation">✓</div>
        <h2>Thank You!</h2>
        <p className="success-message">
          Your registration has been submitted successfully. We've sent a
          confirmation email to <strong>{email}</strong>.
        </p>
        <div className="next-steps">
          <h3>What happens next?</h3>
          <ul>
            <li>You'll receive a welcome email within 24 hours</li>
            <li>Our team will review your information</li>
            <li>We'll contact you if we need any additional details</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="form-step">
      <h2>Review Your Information</h2>
      <p className="step-description">
        Please review all the information you have provided before submitting.
      </p>

      <div className="review-sections">
        <div className="review-section">
          <h3>Personal Information</h3>
          <div className="review-grid">
            <div className="review-item">
              <span className="label">First Name:</span>
              <span className="value">
                {personalInfo.firstName || "Not provided"}
              </span>
            </div>
            <div className="review-item">
              <span className="label">Last Name:</span>
              <span className="value">
                {personalInfo.lastName || "Not provided"}
              </span>
            </div>
            <div className="review-item">
              <span className="label">Phone:</span>
              <span className="value">{formatPhone(personalInfo.phone)}</span>
            </div>
            <div className="review-item">
              <span className="label">Date of Birth:</span>
              <span className="value">
                {formatDate(personalInfo.dateOfBirth)}
              </span>
            </div>
          </div>
        </div>

        <div className="review-section">
          <h3>Account Security</h3>
          <div className="review-grid">
            <div className="review-item">
              <span className="label">User ID:</span>
              <span className="value">{userId || "Not provided"}</span>
            </div>
            <div className="review-item">
              <span className="label">Email:</span>
              <span className="value">{email || "Not provided"}</span>
            </div>
            <div className="review-item">
              <span className="label">Username:</span>
              <span className="value">{username || "Not provided"}</span>
            </div>
          </div>
        </div>

        <div className="review-section">
          <h3>Investment Profile</h3>
          <div className="review-grid">
            <div className="review-item">
              <span className="label">Risk Appetite:</span>
              <span className="value">
                {investmentProfile.riskAppetite || "Not provided"}
              </span>
            </div>
            <div className="review-item">
              <span className="label">Experience:</span>
              <span className="value">
                {investmentProfile.experience || "Not provided"}
              </span>
            </div>
            <div className="review-item">
              <span className="label">Investment Goal:</span>
              <span className="value">
                {investmentProfile.investmentGoal || "Not provided"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4PReview;
