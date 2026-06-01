function LoginModal({ pinInput, setPinInput, pinError, pinLoading, onSubmit, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Admin Login</h2>
        <p>Enter your password to enable edit and delete.</p>
        <form onSubmit={onSubmit}>
          <input
            type="password"
            placeholder="Enter password"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            autoFocus
          />
          {pinError && <p className="pin-error">Incorrect password. Try again.</p>}
          <div className="modal-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={pinLoading}
              style={{ opacity: pinLoading ? 0.7 : 1 }}
            >
              {pinLoading ? "Logging in..." : "Login"}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;