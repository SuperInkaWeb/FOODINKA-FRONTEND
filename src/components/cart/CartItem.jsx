import { Trash2, Plus, Minus } from 'lucide-react'
import { useCartStore } from '../../store/cartStore.js'
import './CartItem.css'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80'

export default function CartItem({ item }) {
  const { increment, decrement, removeItem } = useCartStore()
  const { product, quantity } = item
  const price = product.finalPrice ?? product.price
  const subtotal = price * quantity

  return (
    <div className="cart-item">
      {/* Imagen */}
      <div className="cart-item-img">
        <img
          src={product.imageUrl || PLACEHOLDER}
          alt={product.name}
          onError={e => { e.target.src = PLACEHOLDER }}
        />
      </div>

      {/* Info */}
      <div className="cart-item-info">
        <h4 className="cart-item-name">{product.name}</h4>
        <p className="cart-item-price">
          S/ {price.toFixed(2)} c/u
          {product.discountPct > 0 && (
            <span className="cart-item-discount"> (-{product.discountPct}%)</span>
          )}
        </p>
      </div>

      {/* Controles cantidad */}
      <div className="cart-item-controls">
        <button
          className="cart-item-btn"
          onClick={() => decrement(product.id)}
        >
          {quantity === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
        </button>
        <span className="cart-item-qty">{quantity}</span>
        <button
          className="cart-item-btn cart-item-btn--add"
          onClick={() => increment(product.id)}
        >
          <Plus size={13} />
        </button>
      </div>

      {/* Subtotal */}
      <span className="cart-item-subtotal">
        S/ {subtotal.toFixed(2)}
      </span>
    </div>
  )
}