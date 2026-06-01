import { formatDate, formatTime } from "../../utils/dateUtils";

function ConfirmationModal({ reservation, onClose }) {
  if (!reservation) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal">
        <div className="confirm-icon">🎉</div>
        <h2>Reservation Confirmed!</h2>
        <div className="confirm-details">
          <div className="confirm-row">
            <span className="confirm-label">Name</span>
            <span className="confirm-value">{reservation.name}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-label">Email</span>
            <span className="confirm-value">{reservation.email}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-label">Guests</span>
            <span className="confirm-value">{reservation.guests}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-label">Date</span>
            <span className="confirm-value">{formatDate(reservation.date)}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-label">Time</span>
            <span className="confirm-value">{formatTime(reservation.time)}</span>
          </div>
        </div>
        <p className="confirm-note">See you at Hidden Ridge! 🍽️</p>
        <button className="btn-primary" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

export default ConfirmationModal;