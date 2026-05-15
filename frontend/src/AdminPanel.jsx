import { useState, useEffect } from "react";

function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editGuests, setEditGuests] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");

  // CHECK LOCALSTORAGE + WAKE UP RENDER ON PAGE LOAD
  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
    fetch(`${import.meta.env.VITE_BACKEND_URL}/`).catch(() => {});
  }, []);

  // AUTO LOGOUT AFTER 30 MINUTES OF INACTIVITY
  useEffect(() => {
    if (!isAuthenticated) return;

    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.removeItem("admin_token");
        setToken(null);
        setIsAuthenticated(false);
      }, 30 * 60 * 1000);
    };

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [isAuthenticated]);

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

  useEffect(() => {
    fetchReservations();
  }, []);

// LOGIN - sends password to backend, gets JWT token
  const handlePinSubmit = async (e) => {
    e.preventDefault();
    setPinLoading(true);
    setPinError(false);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pinInput }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPinError(true);
        setPinInput("");
        return;
      }

      localStorage.setItem("admin_token", data.token);
      setToken(data.token);
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setPinInput("");
    } catch (err) {
      console.error("Login error:", err);
      setPinError(true);
    } finally {
      setPinLoading(false);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setIsAuthenticated(false);
  };

  const handleDelete = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reservations/${selectedId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
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
    setEditDate(res.date || "");
    setEditTime(res.time || "");
    setShowEditModal(true);
  };

  const confirmEdit = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reservations/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          guests: editGuests,
          date: editDate,
          time: editTime,
        }),
      });
      fetchReservations();
      setShowEditModal(false);
    } catch (err) {
      console.error("Error editing reservation:", err);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return " ↕";
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  const filteredAndSorted = reservations
    .filter((res) =>
      res.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === "guests") {
        valA = Number(valA);
        valB = Number(valB);
      } else if (sortField === "date" || sortField === "created_at") {
        valA = valA ? new Date(valA) : new Date(0);
        valB = valB ? new Date(valB) : new Date(0);
      } else {
        valA = String(valA || "").toLowerCase();
        valB = String(valB || "").toLowerCase();
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const exportCSV = () => {
    const headers = ["#", "Name", "Guests", "Date", "Time", "Created At"];
    const rows = filteredAndSorted.map((res, index) => [
      index + 1,
      res.name,
      res.guests,
      res.date ? new Date(res.date).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric"
      }) : "—",
      res.time ? (() => {
        const [h, m] = res.time.split(":");
        const hour = parseInt(h);
        return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? "PM" : "AM"}`;
      })() : "—",
      res.created_at ? new Date(res.created_at).toLocaleString("en-US") : "—"
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((val) => `"${val}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reservations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric"
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "—";
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h);
    return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const formatCreatedAt = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <a href="/" className="admin-back-btn">← Back to Website</a>
          {isAuthenticated ? (
            <>
              <button className="admin-export-btn" onClick={exportCSV}>
                ⬇ Export CSV
              </button>
              <button className="admin-logout-btn" onClick={handleLogout}>
                🔒 Lock
              </button>
            </>
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
        <div className="admin-table-header">
          <div>
            <h2>Reservations</h2>
            <p className="admin-count">
              {!loading && (
                <>
                  {filteredAndSorted.length} of {reservations.length} reservation{reservations.length !== 1 ? "s" : ""}
                  {!isAuthenticated && (
                    <span className="admin-view-only"> — View Only</span>
                  )}
                </>
              )}
            </p>
          </div>
          <input
            type="text"
            className="admin-search"
            placeholder="🔍 Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="admin-empty">Loading reservations...</p>
        ) : filteredAndSorted.length === 0 ? (
          <p className="admin-empty">
            {searchQuery ? `No reservations found for "${searchQuery}"` : "No reservations yet."}
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th className="sortable" onClick={() => handleSort("name")}>
                  Name{getSortIcon("name")}
                </th>
                <th className="sortable" onClick={() => handleSort("guests")}>
                  Guests{getSortIcon("guests")}
                </th>
                <th className="sortable" onClick={() => handleSort("date")}>
                  Date{getSortIcon("date")}
                </th>
                <th>Time</th>
                <th className="sortable" onClick={() => handleSort("created_at")}>
                  Submitted{getSortIcon("created_at")}
                </th>
                {isAuthenticated && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((res, index) => (
                <tr key={res.id}>
                  <td>{index + 1}</td>
                  <td>{res.name}</td>
                  <td>{res.guests}</td>
                  <td>{formatDate(res.date)}</td>
                  <td>{formatTime(res.time)}</td>
                  <td>{formatCreatedAt(res.created_at)}</td>
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
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={pinLoading}
                  style={{ opacity: pinLoading ? 0.7 : 1 }}
                >
                  {pinLoading ? "Logging in..." : "Login"}
                </button>
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