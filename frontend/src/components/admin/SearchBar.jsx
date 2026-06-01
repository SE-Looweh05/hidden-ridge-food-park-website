function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      className="admin-search"
      placeholder="🔍 Search by name..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default SearchBar;