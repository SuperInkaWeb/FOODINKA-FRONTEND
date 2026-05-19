import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { ShoppingCart, Trash2, ArrowRight, Store } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore } from '../store/cartStore.js'
import Navbar from '../components/layout/Navbar.jsx'
import CartItem from '../components/cart/CartItem.jsx'
import './Cart.css'

export default function Cart() {
  const navigate = useNavigate()
  const { isAuthenticated, loginWithRedirect } = useAuth0()
  const { items, restaurantName, restaurantId, clearCart, getSubtotal, getTotalItems } = useCartStore()

  const subtotal   = getSubtotal()
  const totalItems = getTotalItems()

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para hacer un pedido')
      loginWithRedirect()
      return
    }
    navigate('/checkout')
  }

  // Carrito vacío
  if (items.length === 0) {
    return (
      <div className="cart-page">
        <Navbar cartCount={0} />
        <div className="cart-empty">
          <ShoppingCart size={56} strokeWidth={1.5} />
          <h2>Tu carrito está vacío</h2>
          <p>Agrega platos y bebidas desde el menú de un restaurante</p>
          <Link to="/" className="cart-empty-btn">
            Ver restaurantes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <Navbar cartCount={totalItems} />

      <div className="cart-inner">
        <h1 className="cart-title">Tu carrito</h1>

        <div className="cart-layout">

          {/* Lista de productos */}
          <div className="cart-main">

            {/* Restaurante */}
            <div className="cart-restaurant">
              <Store size={16} />
              <span>Pedido de <strong>{restaurantName}</strong></span>
              <Link
                to={`/restaurant/${restaurantId}`}
                className="cart-restaurant-link"
              >
                Ver menú
              </Link>
            </div>

            {/* Items */}
            <div className="cart-items">
              {items.map(item => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>

            {/* Vaciar carrito */}
            <button className="cart-clear" onClick={() => {
              clearCart()
              toast.success('Carrito vaciado')
            }}>
              <Trash2 size={14} /> Vaciar carrito
            </button>
          </div>

          {/* Resumen del pedido */}
          <div className="cart-summary">
            <h2 className="cart-summary-title">Resumen</h2>

            <div className="cart-summary-rows">
              <div className="cart-summary-row">
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="cart-summary-row cart-summary-row--note">
                <span>Delivery y otros costos</span>
                <span>Se calculan al confirmar</span>
              </div>
            </div>

            <div className="cart-summary-total">
              <span>Total estimado</span>
              <span>S/ {subtotal.toFixed(2)}</span>
            </div>

            <button
              className="cart-checkout-btn"
              onClick={handleCheckout}
            >
              Continuar al pedido <ArrowRight size={18} />
            </button>

            <Link to="/" className="cart-continue">
              ← Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}