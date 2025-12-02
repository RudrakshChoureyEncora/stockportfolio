import React, { useState, useEffect } from "react";
import "../../styles/ModifyUser.css";
import { useAuth } from "../../context/AuthContext";

const ModifyUserForm = ({ user, onBack, onUpdated }) => {
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState(user.password);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phone, setPhone] = useState(user.phone);
  const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth);
  const [riskAppetite, setRiskAppetite] = useState(user.riskAppetite);
  const [experience, setExperience] = useState(user.experience);
  const [investmentGoal, setInvestmentGoal] = useState(user.investmentGoal);
  const [role, setRole] = useState(user.role);

  // Reset state when user prop changes
  useEffect(() => {
    setUsername(user.username);
    setPassword(user.password);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setPhone(user.phone);
    setDateOfBirth(user.dateOfBirth);
    setRiskAppetite(user.riskAppetite);
    setExperience(user.experience);
    setInvestmentGoal(user.investmentGoal);
    setRole(user.role);
  }, [user]);

  const { updateUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedUser = {
      email: user.email,
      username,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      riskAppetite,
      experience,
      investmentGoal,
      role,
    };

    const result = await updateUser(updatedUser);

    if (result.success) {
      console.log("User Updated!", result.data);
      if (onUpdated) {
        onUpdated();
      }
    } else {
      console.log("Update Failed:", result.error);
    }
  };

  return (
    <div className="modify-user-form">
      <h3>Modify User</h3>
      <p>Editing User: {user.userId}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>
        <div>
          <label>Risk Appetite:</label>
          <select
            value={riskAppetite}
            onChange={(e) => setRiskAppetite(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label>Experience:</label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
        <div>
          <label>Investment Goal:</label>
          <input
            type="text"
            value={investmentGoal}
            onChange={(e) => setInvestmentGoal(e.target.value)}
          />
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <button type="submit" className="submit-button">
          Update User
        </button>
        <button type="button" onClick={onBack} className="back-button">
          Go Back
        </button>
      </form>
    </div>
  );
};

export default ModifyUserForm;
