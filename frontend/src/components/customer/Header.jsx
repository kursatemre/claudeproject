import '../../styles/Header.css';

function Header({ settings }) {
  if (!settings) return null;

  const { restaurant } = settings;

  return (
    <header className="menu-header">
      <div className="header-content">
        <div className="logo-section">
          {restaurant.logo && (
            <img src={restaurant.logo} alt={restaurant.name} className="logo" />
          )}
          <div className="restaurant-info">
            <h1>{restaurant.name}</h1>
            {restaurant.slogan && <p className="slogan">{restaurant.slogan}</p>}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
