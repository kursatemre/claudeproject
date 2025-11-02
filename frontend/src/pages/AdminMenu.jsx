import { useState, useEffect } from 'react';
import { menuAPI } from '../utils/api';
import AdminLayout from '../components/admin/AdminLayout';
import '../styles/AdminMenu.css';

function AdminMenu() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [modalType, setModalType] = useState('product');
  const [editingItem, setEditingItem] = useState(null);

  const [productForm, setProductForm] = useState({
    name: '',
    categoryId: '',
    price: '',
    description: '',
    image: '',
    tags: '',
    allergens: '',
    active: true
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    order: '',
    active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesResponse, productsResponse] = await Promise.all([
        menuAPI.getAllCategories(),
        menuAPI.getAllProducts()
      ]);
      setCategories(categoriesResponse.data.data);
      setProducts(productsResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddProductModal = () => {
    setModalMode('add');
    setModalType('product');
    setProductForm({
      name: '',
      categoryId: categories[0]?.id || '',
      price: '',
      description: '',
      image: '/images/default-product.jpg',
      tags: '',
      allergens: '',
      active: true
    });
    setShowModal(true);
  };

  const openEditProductModal = (product) => {
    setModalMode('edit');
    setModalType('product');
    setEditingItem(product);
    setProductForm({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
      description: product.description || '',
      image: product.image || '',
      tags: product.tags?.join(', ') || '',
      allergens: product.allergens?.join(', ') || '',
      active: product.active
    });
    setShowModal(true);
  };

  const openAddCategoryModal = () => {
    setModalMode('add');
    setModalType('category');
    setCategoryForm({
      name: '',
      description: '',
      order: categories.length + 1,
      active: true
    });
    setShowModal(true);
  };

  const openEditCategoryModal = (category) => {
    setModalMode('edit');
    setModalType('category');
    setEditingItem(category);
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      order: category.order,
      active: category.active
    });
    setShowModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...productForm,
      price: parseFloat(productForm.price),
      tags: productForm.tags.split(',').map(t => t.trim()).filter(t => t),
      allergens: productForm.allergens.split(',').map(a => a.trim()).filter(a => a)
    };

    try {
      if (modalMode === 'add') {
        await menuAPI.addProduct(data);
      } else {
        await menuAPI.updateProduct(editingItem.id, data);
      }
      await fetchData();
      closeModal();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Ürün kaydedilirken bir hata oluştu');
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...categoryForm,
      order: parseInt(categoryForm.order)
    };

    try {
      if (modalMode === 'add') {
        await menuAPI.addCategory(data);
      } else {
        await menuAPI.updateCategory(editingItem.id, data);
      }
      await fetchData();
      closeModal();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Kategori kaydedilirken bir hata oluştu');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await menuAPI.deleteProduct(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Ürün silinirken bir hata oluştu');
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await menuAPI.deleteCategory(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(error.response?.data?.message || 'Kategori silinirken bir hata oluştu');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Bilinmeyen Kategori';
  };

  if (loading) {
    return (
      <AdminLayout title="Menü Yönetimi">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Menü Yönetimi">
      <div className="menu-management">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Ürünler ({products.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            Kategoriler ({categories.length})
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Ürünler</h2>
              <button className="btn btn-primary" onClick={openAddProductModal}>
                + Yeni Ürün Ekle
              </button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Ürün Adı</th>
                    <th>Kategori</th>
                    <th>Fiyat</th>
                    <th>Durum</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{getCategoryName(product.categoryId)}</td>
                      <td>{product.price.toFixed(2)} ₺</td>
                      <td>
                        <span className={`badge ${product.active ? 'badge-ready' : 'badge-completed'}`}>
                          {product.active ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button
                            className="btn btn-secondary action-btn"
                            onClick={() => openEditProductModal(product)}
                          >
                            Düzenle
                          </button>
                          <button
                            className="btn btn-danger action-btn"
                            onClick={() => deleteProduct(product.id)}
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Kategoriler</h2>
              <button className="btn btn-primary" onClick={openAddCategoryModal}>
                + Yeni Kategori Ekle
              </button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Kategori Adı</th>
                    <th>Açıklama</th>
                    <th>Sıra</th>
                    <th>Durum</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.description}</td>
                      <td>{category.order}</td>
                      <td>
                        <span className={`badge ${category.active ? 'badge-ready' : 'badge-completed'}`}>
                          {category.active ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button
                            className="btn btn-secondary action-btn"
                            onClick={() => openEditCategoryModal(category)}
                          >
                            Düzenle
                          </button>
                          <button
                            className="btn btn-danger action-btn"
                            onClick={() => deleteCategory(category.id)}
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  {modalMode === 'add' ? 'Yeni ' : 'Düzenle: '}
                  {modalType === 'product' ? 'Ürün' : 'Kategori'}
                </h2>
                <button className="modal-close" onClick={closeModal}>×</button>
              </div>

              <div className="modal-body">
                {modalType === 'product' ? (
                  <form onSubmit={handleProductSubmit}>
                    <div className="form-group">
                      <label>Ürün Adı *</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Kategori *</label>
                      <select
                        value={productForm.categoryId}
                        onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Fiyat (₺) *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Açıklama</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Görsel URL</label>
                      <input
                        type="text"
                        value={productForm.image}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Etiketler (virgülle ayırın)</label>
                      <input
                        type="text"
                        value={productForm.tags}
                        onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                        placeholder="Örn: Popüler, Yeni, Acı"
                      />
                    </div>

                    <div className="form-group">
                      <label>Alerjenler (virgülle ayırın)</label>
                      <input
                        type="text"
                        value={productForm.allergens}
                        onChange={(e) => setProductForm({ ...productForm, allergens: e.target.value })}
                        placeholder="Örn: Süt, Gluten, Yumurta"
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={productForm.active}
                          onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
                        />
                        {' '}Aktif
                      </label>
                    </div>

                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={closeModal}>
                        İptal
                      </button>
                      <button type="submit" className="btn btn-primary">
                        {modalMode === 'add' ? 'Ekle' : 'Güncelle'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleCategorySubmit}>
                    <div className="form-group">
                      <label>Kategori Adı *</label>
                      <input
                        type="text"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Açıklama</label>
                      <textarea
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Sıra</label>
                      <input
                        type="number"
                        value={categoryForm.order}
                        onChange={(e) => setCategoryForm({ ...categoryForm, order: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={categoryForm.active}
                          onChange={(e) => setCategoryForm({ ...categoryForm, active: e.target.checked })}
                        />
                        {' '}Aktif
                      </label>
                    </div>

                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={closeModal}>
                        İptal
                      </button>
                      <button type="submit" className="btn btn-primary">
                        {modalMode === 'add' ? 'Ekle' : 'Güncelle'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminMenu;
