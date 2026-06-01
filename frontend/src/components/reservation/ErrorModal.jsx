function ErrorModal({ message, onClose }) {
  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal">
        <div className="confirm-icon">⚠️</div>
        <h2>Oops!</h2>
        <p style={{ opacity: 1, marginBottom: "20px" }}>{message}</p>
        <button className="btn-primary" onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}

export default ErrorModal;