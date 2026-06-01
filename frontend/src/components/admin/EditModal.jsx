function EditModal({ editName, setEditName, editGuests, setEditGuests, onSave, onClose }) {
  return (
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
          <button className="btn-primary" onClick={onSave}>Save</button>
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;