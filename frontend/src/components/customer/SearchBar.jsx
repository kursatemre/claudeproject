import '../../styles/SearchBar.css';

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Ürün ara..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      {searchQuery && (
        <button
          className="clear-btn"
          onClick={() => setSearchQuery('')}
          aria-label="Aramayı temizle"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default SearchBar;
