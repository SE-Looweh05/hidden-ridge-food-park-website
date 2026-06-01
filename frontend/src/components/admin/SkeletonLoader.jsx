function SkeletonLoader({ isAuthenticated }) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>#</th><th>Name</th><th>Guests</th><th>Email</th>
          <th>Date</th><th>Time</th><th>Submitted</th>
          {isAuthenticated && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, i) => (
          <tr key={i} className="skeleton-row">
            <td><div className="skeleton-cell short" /></td>
            <td><div className="skeleton-cell medium" /></td>
            <td><div className="skeleton-cell short" /></td>
            <td><div className="skeleton-cell long" /></td>
            <td><div className="skeleton-cell medium" /></td>
            <td><div className="skeleton-cell short" /></td>
            <td><div className="skeleton-cell long" /></td>
            {isAuthenticated && <td><div className="skeleton-cell medium" /></td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SkeletonLoader;