import '../../styles/MenuItem.css';

function MenuItem({ product }) {
  return (
    <div className="menu-item">
      <div className="menu-item-image">
        <img src={product.image} alt={product.name} />
        {product.tags && product.tags.length > 0 && (
          <div className="item-tags">
            {product.tags.map((tag, index) => (
              <span key={index} className="item-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
      <div className="menu-item-content">
        <div className="item-header">
          <h3>{product.name}</h3>
          <span className="item-price">{product.price.toFixed(2)} ₺</span>
        </div>
        {product.description && (
          <p className="item-description">{product.description}</p>
        )}
        {product.allergens && product.allergens.length > 0 && (
          <div className="item-allergens">
            <small>
              <strong>Alerjenler:</strong> {product.allergens.join(', ')}
            </small>
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuItem;
