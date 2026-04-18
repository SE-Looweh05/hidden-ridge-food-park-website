import { useState, useEffect } from "react";

function AdminPanel() {
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
        <a href="/" className="admin-back-btn">← Back to Website</a>
      </div>

      {/* TABLE */}
      <div className="admin-content">
        <h2>Reservations</h2>
        <p className="admin-count">{reservations.length} reservation{reservations.length !== 1 ? "s" : ""} total</p>

        {reservations.length === 0 ? (
          <p className="admin-empty">No reservations yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Guests</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res, index) => (
                <tr key={res.id}>
                  <td>{index + 1}</td>
                  <td>{res.name}</td>
                  <td>{res.guests}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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