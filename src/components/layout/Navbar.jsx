// src/components/layout/Navbar.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import {
  ShoppingCart, Menu, X, User, LogOut,
  LayoutDashboard, Bike, ClipboardList, Store,
} from 'lucide-react'
import { useCartStore } from '../../store/cartStore.js'
import { useCurrentUser } from '../../hooks/useCurrentUser.js'
import './Navbar.css'

export default function Navbar({ cartCount }) {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0()
  const { data: dbUser } = useCurrentUser()
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate   = useNavigate()
  const totalItems = useCartStore(s => s.getTotalItems())
  const count      = cartCount ?? totalItems

  const role              = dbUser?.role || null
  const isAdmin           = role === 'ADMIN'
  const isDriver          = role === 'DELIVERY'
  const isRestaurantOwner = role === 'RESTAURANT_OWNER'
  const isConsumer        = role === 'CONSUMER' || !role

  const handleLogout = () => {
    setProfileOpen(false)
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  const go = (path) => {
    setProfileOpen(false)
    setMenuOpen(false)
    navigate(path)
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Logo imagen */}
        <Link to="/" className="navbar-logo">
          <img
            src="/logo.jpeg"
            alt="Antojia"
            className="navbar-logo-img"
          />
        </Link>

        {/* Acciones desktop */}
        <div className="navbar-actions">
          <Link to="/cart" className="navbar-cart">
            <ShoppingCart size={20} />
            {count > 0 && <span className="navbar-cart-badge">{count}</span>}
          </Link>

          {!isAuthenticated && (
            <button className="navbar-btn-login" onClick={() => loginWithRedirect()}>
              Iniciar sesión
            </button>
          )}

          {isAuthenticated && (
            <div className="navbar-profile">
              <button className="navbar-avatar" onClick={() => setProfileOpen(p => !p)}>
                {user?.picture
                  ? <img src={user.picture} alt={user.name} />
                  : <User size={18} />
                }
              </button>

              {profileOpen && (
                <div className="navbar-dropdown">
                  <div className="navbar-dropdown-header">
                    <p className="navbar-dropdown-name">{user?.name}</p>
                    <p className="navbar-dropdown-email">{user?.email}</p>
                  </div>
                  <div className="navbar-dropdown-divider" />

                  <button onClick={() => go('/profile')}>
                    <User size={15} /> Mi perfil
                  </button>
                  <button onClick={() => go('/orders')}>
                    <ShoppingCart size={15} /> Mis pedidos
                  </button>

                  {isRestaurantOwner && (
                    <button onClick={() => go('/restaurant-dashboard')}>
                      <ClipboardList size={15} /> Ver pedidos del restaurante
                    </button>
                  )}

                  {isConsumer && !isRestaurantOwner && !isDriver && (
                    <button onClick={() => go('/register-restaurant')}>
                      <Store size={15} /> Inscribir mi restaurante
                    </button>
                  )}

                  <div className="navbar-dropdown-divider" />

                  {isDriver && (
                    <button onClick={() => go('/driver')}>
                      <Bike size={15} /> Panel repartidor
                    </button>
                  )}
                  {isConsumer && !isRestaurantOwner && (
                    <button onClick={() => go('/become-driver')}>
                      <Bike size={15} /> Ser repartidor
                    </button>
                  )}

                  {isAdmin && (
                    <button onClick={() => go('/admin')}>
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
        <button className="navbar-hamburger" onClick={() => setMenuOpen(m => !m)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Menú mobile */}
      {menuOpen && (
        <div className="navbar-mobile">
          <Link to="/"     onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            Carrito {count > 0 && `(${count})`}
          </Link>
          {!isAuthenticated
            ? <button onClick={() => loginWithRedirect()}>Iniciar sesión</button>
            : <>
                <Link to="/profile" onClick={() => setMenuOpen(false)}>Mi perfil</Link>
                <Link to="/orders"  onClick={() => setMenuOpen(false)}>Mis pedidos</Link>
                {isRestaurantOwner && (
                  <Link to="/restaurant-dashboard" onClick={() => setMenuOpen(false)}>
                    Ver pedidos del restaurante
                  </Link>
                )}
                {isConsumer && !isRestaurantOwner && !isDriver && (
                  <Link to="/register-restaurant" onClick={() => setMenuOpen(false)}>
                    Inscribir mi restaurante
                  </Link>
                )}
                {isDriver && (
                  <Link to="/driver" onClick={() => setMenuOpen(false)}>Panel repartidor</Link>
                )}
                {isConsumer && !isRestaurantOwner && (
                  <Link to="/become-driver" onClick={() => setMenuOpen(false)}>Ser repartidor</Link>
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