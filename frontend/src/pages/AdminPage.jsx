import { useState, useEffect } from "react";
import { useAdminAuth } from "../hooks/useAdminAuth";
import AdminHeader from "../components/admin/AdminHeader";
import SearchBar from "../components/admin/SearchBar";
import ReservationTable from "../components/admin/ReservationTable";
import LoginModal from "../components/admin/LoginModal";
import EditModal from "../components/admin/EditModal";
import DeleteModal from "../components/admin/DeleteModal";
import { exportCSV } from "../utils/csvExport";

function AdminPage() {
  const {
    isAuthenticated, token,
    showLoginModal, setShowLoginModal,
    pinInput, setPinInput,
    pinError, setPinError,
    pinLoading,
    handlePinSubmit, handleLogout, handleExpiredToken,
    showSessionExpiredModal, setShowSessionExpiredModal,
  } = useAdminAuth();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editGuests, setEditGuests] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reservations`);
      const data = await res.json();
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReservations(); }, []);

  const handleSort = (field) => {
    if (sortField === field) setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDirection("asc"); }
  };

  const filteredAndSorted = reservations
    .filter((res) => res.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      let valA = a[sortField], valB = b[sortField];
      if (sortField === "guests") { valA = Number(valA); valB = Number(valB); }
      else if (sortField === "date" || sortField === "created_at") {
        valA = valA ? new Date(valA) : new Date(0);
        valB = valB ? new Date(valB) : new Date(0);
      } else { valA = String(valA || "").toLowerCase(); valB = String(valB || "").toLowerCase(); }
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const handleDeleteClick = (id) => { setSelectedId(id); setShowDeleteModal(true); };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reservations/${selectedId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (handleExpiredToken(res.status)) {
        setShowDeleteModal(false);  // ← add this
        setSelectedId(null);        // ← add this
        return;
      }
      fetchReservations();
      setShowDeleteModal(false);
      setSelectedId(null);
    } catch (err) { console.error("Error deleting:", err); }
  };

  const handleEditClick = (res) => {
    setEditId(res.id); setEditName(res.name);
    setEditGuests(res.guests); setEditDate(res.date || ""); setEditTime(res.time || "");
    setShowEditModal(true);
  };

  const confirmEdit = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reservations/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ name: editName, guests: editGuests, date: editDate, time: editTime }),
      });
      if (handleExpiredToken(res.status)) {
        setShowEditModal(false);  // ← add this
        return;
      }
      fetchReservations();
      setShowEditModal(false);
    } catch (err) { console.error("Error editing:", err); }
  };

  return (
    <div className="admin-page">
      <AdminHeader
        isAuthenticated={isAuthenticated}
        onExportCSV={() => exportCSV(filteredAndSorted)}
        onLogout={handleLogout}
        onLoginClick={() => setShowLoginModal(true)}
      />

      <div className="admin-content">
        <div className="admin-table-header">
          <div>
            <h2>Reservations</h2>
            <p className="admin-count">
              {!loading && (
                <>
                  {filteredAndSorted.length} of {reservations.length} reservation{reservations.length !== 1 ? "s" : ""}
                  {!isAuthenticated && <span className="admin-view-only"> — View Only</span>}
                </>
              )}
            </p>
          </div>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <ReservationTable
          loading={loading}
          reservations={filteredAndSorted}
          searchQuery={searchQuery}
          isAuthenticated={isAuthenticated}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>

      {showLoginModal && (
        <LoginModal
          pinInput={pinInput} setPinInput={setPinInput}
          pinError={pinError} pinLoading={pinLoading}
          onSubmit={handlePinSubmit}
          onClose={() => { setShowLoginModal(false); setPinError(false); setPinInput(""); }}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          onConfirm={confirmDelete}
          onClose={() => setShowDeleteModal(false)}
        />
      )}

      {showEditModal && (
        <EditModal
          editName={editName} setEditName={setEditName}
          editGuests={editGuests} setEditGuests={setEditGuests}
          onSave={confirmEdit}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* SESSION EXPIRED MODAL */}
      {showSessionExpiredModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="confirm-icon">🔒</div>
            <h2>Session Expired</h2>
            <p style={{ opacity: 1, marginBottom: "20px" }}>
              Your session has expired. Please log in again to continue.
            </p>
            <button
              className="btn-primary"
              onClick={() => {
                setShowSessionExpiredModal(false);
                setShowLoginModal(true);
              }}
            >
              Log In Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;