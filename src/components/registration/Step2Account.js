import { useRUContext } from "../../context/RegisterUserContext";

const Step2Account = () => {
  const { userId, email, username, password, updateField, errors } =
    useRUContext();

  const handleChange = (field, value) => {
    updateField({ key: field, value });
  };

  return (
    <div className="form-step">
      <h2>Account Security</h2>
      <p className="step-description">
        Please create your account credentials.
      </p>

      <div className="form-group">
        <label htmlFor="userId">User ID *</label>
        <input
          id="userId"
          type="text"
          value={userId || ""}
          onChange={(e) => handleChange("userId", e.target.value)}
          className={errors.userId ? "error" : ""}
          placeholder="Enter your user ID"
        />
        {errors.userId && <span className="error-text">{errors.userId}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          type="email"
          value={email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          className={errors.email ? "error" : ""}
          placeholder="Enter your email"
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="username">Username *</label>
        <input
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => handleChange("username", e.target.value)}
          className={errors.username ? "error" : ""}
          placeholder="Enter your username"
        />
        {errors.username && (
          <span className="error-text">{errors.username}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password *</label>
        <input
          id="password"
          type="password"
          value={password || ""}
          onChange={(e) => handleChange("password", e.target.value)}
          className={errors.password ? "error" : ""}
          placeholder="Enter your password"
        />
        {errors.password && (
          <span className="error-text">{errors.password}</span>
        )}
      </div>
    </div>
  );
};

export default Step2Account;
