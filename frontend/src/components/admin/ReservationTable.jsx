import SkeletonLoader from "./SkeletonLoader";
import { formatDateShort, formatTime, formatCreatedAt } from "../../utils/dateUtils";

function ReservationTable({
  loading, reservations, searchQuery,
  isAuthenticated, sortField, sortDirection,
  onSort, onEdit, onDelete,
}) {
  const getSortIcon = (field) => {
    if (sortField !== field) return " ↕";
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  if (loading) return <SkeletonLoader isAuthenticated={isAuthenticated} />;

  if (reservations.length === 0) {
    return (
      <p className="admin-empty">
        {searchQuery ? `No reservations found for "${searchQuery}"` : "No reservations yet."}
      </p>
    );
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>#</th>
          <th className="sortable" onClick={() => onSort("name")}>Name{getSortIcon("name")}</th>
          <th className="sortable" onClick={() => onSort("guests")}>Guests{getSortIcon("guests")}</th>
          {isAuthenticated && <th className="sortable" onClick={() => onSort("email")}>Email{getSortIcon("email")}</th>}
          <th className="sortable" onClick={() => onSort("date")}>Date{getSortIcon("date")}</th>
          <th>Time</th>
          {isAuthenticated && <th className="sortable" onClick={() => onSort("created_at")}>Submitted{getSortIcon("created_at")}</th>}
          {isAuthenticated && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {reservations.map((res, index) => (
          <tr key={res.id}>
            <td>{index + 1}</td>
            <td>{res.name}</td>
            <td>{res.guests}</td>
            {isAuthenticated && <td>{res.email || "—"}</td>}
            <td>{formatDateShort(res.date)}</td>
            <td>{formatTime(res.time)}</td>
            {isAuthenticated && <td>{formatCreatedAt(res.created_at)}</td>}
            {isAuthenticated && (
              <td>
                <button className="admin-btn-edit" onClick={() => onEdit(res)}>Edit</button>
                <button className="admin-btn-delete" onClick={() => onDelete(res.id)}>Delete</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ReservationTable;