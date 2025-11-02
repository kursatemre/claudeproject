import { useState, useEffect } from 'react';
import { menuAPI, settingsAPI } from '../utils/api';
import Header from '../components/customer/Header';
import CategoryFilter from '../components/customer/CategoryFilter';
import SearchBar from '../components/customer/SearchBar';
import MenuItem from '../components/customer/MenuItem';
import '../styles/MenuPage.css';

function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, searchQuery, products]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [menuResponse, settingsResponse] = await Promise.all([
        menuAPI.getMenu(),
        settingsAPI.getSettings()
      ]);

      setCategories(menuResponse.data.data.categories);
      setProducts(menuResponse.data.data.products);
      setSettings(settingsResponse.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Menü yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Kategori filtresi
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.categoryId === selectedCategory);
    }

    // Arama filtresi
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredProducts(filtered);
  };

  const groupProductsByCategory = () => {
    const grouped = {};
    categories.forEach(category => {
      const categoryProducts = filteredProducts.filter(
        product => product.categoryId === category.id
      );
      if (categoryProducts.length > 0) {
        grouped[category.id] = {
          category,
          products: categoryProducts
        };
      }
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Hata</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchData}>
          Tekrar Dene
        </button>
      </div>
    );
  }

  const groupedProducts = groupProductsByCategory();

  return (
    <div className="menu-page">
      <Header settings={settings} />

      <div className="menu-container">
        <div className="menu-controls">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        <div className="menu-content">
          {Object.keys(groupedProducts).length === 0 ? (
            <div className="no-results">
              <p>Aradığınız kriterlere uygun ürün bulunamadı.</p>
            </div>
          ) : (
            Object.values(groupedProducts).map(({ category, products }) => (
              <div key={category.id} className="category-section">
                <div className="category-header">
                  <h2>{category.name}</h2>
                  {category.description && <p>{category.description}</p>}
                </div>
                <div className="products-grid">
                  {products.map(product => (
                    <MenuItem key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <footer className="menu-footer">
        <div className="container">
          <p>&copy; 2025 {settings?.restaurant?.name}. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}

export default MenuPage;
