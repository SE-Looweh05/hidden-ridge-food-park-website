function DeleteModal({ onConfirm, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Delete Reservation</h2>
        <p>Are you sure you want to delete this reservation?</p>
        <div className="modal-actions">
          <button className="btn-delete" onClick={onConfirm}>Delete</button>
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;