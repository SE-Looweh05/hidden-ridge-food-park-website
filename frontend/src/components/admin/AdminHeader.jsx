function AdminHeader({ isAuthenticated, onExportCSV, onLogout, onLoginClick }) {
  return (
    <div className="admin-header">
      <h1>Admin Panel</h1>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <a href="/" className="admin-back-btn">← Back to Website</a>
        {isAuthenticated ? (
          <>
            <button className="admin-export-btn" onClick={onExportCSV}>⬇ Export CSV</button>
            <button className="admin-logout-btn" onClick={onLogout}>🔒 Lock</button>
          </>
        ) : (
          <button className="admin-login-btn" onClick={onLoginClick}>🔑 Admin Login</button>
        )}
      </div>
    </div>
  );
}

export default AdminHeader;