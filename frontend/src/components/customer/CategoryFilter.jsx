import '../../styles/CategoryFilter.css';

function CategoryFilter({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="category-filter">
      <button
        className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
        onClick={() => setSelectedCategory('all')}
      >
        Tümü
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
          onClick={() => setSelectedCategory(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
