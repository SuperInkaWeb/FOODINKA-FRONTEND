import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { ShoppingCart, Menu, X, ChefHat, User, LogOut, LayoutDashboard, Bike } from 'lucide-react'
import { useUser } from '../../hooks/useUser.js'
import './Navbar.css'

export default function Navbar({ cartCount = 0 }) {
  const { isAuthenticated, loginWithRedirect, logout, user: auth0User } = useAuth0()
  const { isAdmin, isDriver, isOwner, user } = useUser()
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    setProfileOpen(false)
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <ChefHat size={26} strokeWidth={2} />
          <span>Foodinka</span>
        </Link>

        {/* Acciones desktop */}
        <div className="navbar-actions">

          {/* Carrito — solo consumidores */}
          {(!isDriver && !isAdmin) && (
            <Link to="/cart" className="navbar-cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="navbar-cart-badge">{cartCount}</span>
              )}
            </Link>
          )}

          {/* Sin sesión */}
          {!isAuthenticated && (
            <button
              className="navbar-btn-login"
              onClick={() => loginWithRedirect()}
            >
              Iniciar sesión
            </button>
          )}

          {/* Con sesión */}
          {isAuthenticated && (
            <div className="navbar-profile">
              <button
                className="navbar-avatar"
                onClick={() => setProfileOpen(p => !p)}
              >
                {auth0User?.picture
                  ? <img src={auth0User.picture} alt={auth0User.name} />
                  : <User size={18} />
                }
              </button>

              {profileOpen && (
                <div className="navbar-dropdown">
                  <div className="navbar-dropdown-header">
                    <p className="navbar-dropdown-name">{auth0User?.name}</p>
                    <p className="navbar-dropdown-email">{auth0User?.email}</p>
                    {user?.role && (
                      <span className="navbar-dropdown-role">
                        {user.role === 'ADMIN'            && '👑 Administrador'}
                        {user.role === 'RESTAURANT_OWNER' && '🏪 Restaurante'}
                        {user.role === 'DELIVERY'         && '🛵 Repartidor'}
                        {user.role === 'CONSUMER'         && '🍽️ Consumidor'}
                      </span>
                    )}
                  </div>

                  <div className="navbar-dropdown-divider" />

                  {/* Perfil — todos */}
                  <button onClick={() => { navigate('/profile'); setProfileOpen(false) }}>
                    <User size={15} /> Mi perfil
                  </button>

                  {/* Mis pedidos — solo consumidores */}
                  {isAuthenticated && !isAdmin && !isDriver && (
                    <button onClick={() => { navigate('/orders'); setProfileOpen(false) }}>
                      <ShoppingCart size={15} /> Mis pedidos
                    </button>
                  )}

                  {/* Panel de repartidor */}
                  {isDriver && (
                    <button onClick={() => { navigate('/driver'); setProfileOpen(false) }}>
                      <Bike size={15} /> Panel de repartidor
                    </button>
                  )}

                  {/* Dashboard admin — SOLO ADMIN */}
                  {isAdmin && (
                    <button onClick={() => { navigate('/admin'); setProfileOpen(false) }}>
                      <LayoutDashboard size={15} /> Dashboard admin
                    </button>
                  )}

                  <div className="navbar-dropdown-divider" />
                  <button className="navbar-dropdown-logout" onClick={handleLogout}>
                    <LogOut size={15} /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hamburguesa mobile */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(m => !m)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Menú mobile */}
      {menuOpen && (
        <div className="navbar-mobile">
          <Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>

          {!isAdmin && !isDriver && (
            <Link to="/cart" onClick={() => setMenuOpen(false)}>
              Carrito {cartCount > 0 && `(${cartCount})`}
            </Link>
          )}

          {!isAuthenticated
            ? <button onClick={() => loginWithRedirect()}>Iniciar sesión</button>
            : <>
                <Link to="/profile" onClick={() => setMenuOpen(false)}>Mi perfil</Link>
                {!isAdmin && !isDriver && (
                  <Link to="/orders" onClick={() => setMenuOpen(false)}>Mis pedidos</Link>
                )}
                {isDriver && (
                  <Link to="/driver" onClick={() => setMenuOpen(false)}>Panel de repartidor</Link>
                )}
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}>Dashboard admin</Link>
                )}
                <button onClick={handleLogout}>Cerrar sesión</button>
              </>
          }
        </div>
      )}
    </nav>
  )
}