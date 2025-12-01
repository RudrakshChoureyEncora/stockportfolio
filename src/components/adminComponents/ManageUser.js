import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAllUsers, deleteUser } = useAuth();
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

  // Delete user
  const deleteUserMethod = async (userId) => {
    setLoading(true);
    const res = await deleteUser(userId);
    if (res.success) {
      // remove user from state
      setLoading(false);
      fetchUsers();

      alert("User deleted successfully!");
    } else {
      console.error("Delete failed:", res.error);
    }
  };

  const modifyUser = (userId) => {
    alert(`Modify user: ${userId}`);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div style={styles.container}>
          <h1>Manage Users</h1>

          <div style={styles.list}>
            {users.map((user) => (
              <div key={user.userId} style={styles.card}>
                <div style={styles.info}>
                  <p>
                    <strong>User ID:</strong> {user.userId}
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

                <div style={styles.actions}>
                  <button
                    style={styles.modifyBtn}
                    onClick={() => modifyUser(user.userId)}
                  >
                    Modify
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteUserMethod(user.userId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// Styles
const styles = {
  container: {
    padding: "20px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    background: "#0f172a",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  info: {
    flex: 1,
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  modifyBtn: {
    padding: "8px 14px",
    background: "#007bff",
    border: "none",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "8px 14px",
    background: "#dc3545",
    border: "none",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer",
  },
};

export default ManageUser;
