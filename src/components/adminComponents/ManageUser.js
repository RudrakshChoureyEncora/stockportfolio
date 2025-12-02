import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ModifyUserForm from "./ModifyUser";
import "../../styles/ManageUser.css";
import { useNavigate } from "react-router-dom";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAllUsers, deleteUser } = useAuth();
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState(null);
  const [showModifyForm, setShowModifyForm] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    const response = await getAllUsers();
    if (response.success) {
      setUsers(response.data);
      setLoading(false);
    } else {
      console.log("Error:", response.error);
    }
  };

  const deleteUserMethod = async (emailId) => {
    setLoading(true);
    const res = await deleteUser(emailId);

    if (res.success) {
      fetchUsers();
      // navigate("/output", { state: res });
    } else {
      // navigate("/output", { state: res });
    }
  };

  const handleModify = (user) => {
    setSelectedUser(user);
    setShowModifyForm(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleBack = () => {
    setSelectedUser(null);
    setShowModifyForm(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="manage-users">
      <div className="manage-users-layout">
        {/* LEFT SIDE LIST */}
        <div className="users-content">
          <h2>Manage Users</h2>
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <div className="user-list">
              {users.map((user) => (
                <div key={user.userId} className="user-card">
                  <div className="info">
                    <p>
                      <strong>ID:</strong> {user.userId}
                    </p>
                    <p>
                      <strong>Name:</strong> {user.firstName} {user.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Role:</strong> {user.role}
                    </p>
                  </div>
                  <div className="actions">
                    <button
                      className="modify-btn"
                      onClick={() => handleModify(user)}
                    >
                      Modify
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteUserMethod(user.email)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE SIDEBAR */}
        <div className="users-sidebar">
          {showModifyForm ? (
            <ModifyUserForm
              user={selectedUser}
              onBack={handleBack}
              onUpdated={fetchUsers}
            />
          ) : (
            <p>Select a user to modify.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
