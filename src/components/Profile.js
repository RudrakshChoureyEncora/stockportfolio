import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";
export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>{user.firstName + " " + user.lastName}</h1>
        <p className="email">{user.email}</p>
      </div>

      <div className="profile-section">
        <h2>Account Details</h2>
        <div className="profile-grid">
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone || "Not provided"}
          </p>
          <p>
            <strong>Date of Birth:</strong> {user.dateOfBirth}
          </p>
          <p>
            <strong>Role:</strong> {user.role || "User"}
          </p>
        </div>
      </div>

      <div className="profile-section">
        <h2>Investment Profile</h2>
        <div className="profile-grid">
          <p>
            <strong>Risk Appetite:</strong> {user.riskAppetite}
          </p>
          <p>
            <strong>Experience:</strong> {user.experience}
          </p>
          <p>
            <strong>Investment Goal:</strong> {user.investmentGoal}
          </p>
        </div>
      </div>
    </div>
  );
}
