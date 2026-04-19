import { useState, useEffect } from "react";

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN;

function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const [reservations, setReservations] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editGuests, setEditGuests] = useState("");

  const fetchReservations = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reservations`);
      const data = await res.json();
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setReservations([]);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setPinError(false);
      setPinInput("");
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  const handleDelete = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reservations/${selectedId}`, {
        method: "DELETE",
      });
      fetchReservations();
      setShowDeleteModal(false);
      setSelectedId(null);
    } catch (err) {
      console.error("Error deleting reservation:", err);
    }
  };

  const handleEdit = (res) => {
    setEditId(res.id);
    setEditName(res.name);
    setEditGuests(res.guests);
    setShowEditModal(true);
  };

  const confirmEdit = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reservations/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, guests: editGuests }),
      });
      fetchReservations();
      setShowEditModal(false);
    } catch (err) {
      console.error("Error editing reservation:", err);
    }
  };

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <a href="/" className="admin-back-btn">← Back to Website</a>
          {isAuthenticated ? (
            <button
              className="admin-logout-btn"
              onClick={() => setIsAuthenticated(false)}
            >
              🔒 Lock
            </button>
          ) : (
            <button
              className="admin-login-btn"
              onClick={() => setShowLoginModal(true)}
            >
              🔑 Admin Login
            </button>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="admin-content">
        <h2>Reservations</h2>
        <p className="admin-count">
          {reservations.length} reservation{reservations.length !== 1 ? "s" : ""} total
          {!isAuthenticated && (
            <span className="admin-view-only"> — View Only</span>
          )}
        </p>

        {reservations.length === 0 ? (
          <p className="admin-empty">No reservations yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Guests</th>
                {isAuthenticated && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {reservations.map((res, index) => (
                <tr key={res.id}>
                  <td>{index + 1}</td>
                  <td>{res.name}</td>
                  <td>{res.guests}</td>
                  {isAuthenticated && (
                    <td>
                      <button
                        className="admin-btn-edit"
                        onClick={() => handleEdit(res)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn-delete"
                        onClick={() => handleDelete(res.id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Admin Login</h2>
            <p>Enter your password to enable edit and delete.</p>
            <form onSubmit={handlePinSubmit}>
              <input
                type="password"
                placeholder="Enter password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
              />
              {pinError && (
                <p className="pin-error">Incorrect password. Try again.</p>
              )}
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Login</button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowLoginModal(false);
                    setPinError(false);
                    setPinInput("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Delete Reservation</h2>
            <p>Are you sure you want to delete this reservation?</p>
            <div className="modal-actions">
              <button className="btn-delete" onClick={confirmDelete}>Delete</button>
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Reservation</h2>
            <input
              type="text"
              placeholder="Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Guests"
              value={editGuests}
              min="1"
              onChange={(e) => setEditGuests(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn-primary" onClick={confirmEdit}>Save</button>
              <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminPanel;