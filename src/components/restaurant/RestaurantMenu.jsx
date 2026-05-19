import { useState } from 'react'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore } from '../../store/cartStore.js'
import './RestaurantMenu.css'

const PLACEHOLDER_DISH = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'

function ProductCard({ product, restaurantId, restaurantName }) {
  const addItem = useCartStore(s => s.addItem)
  const { name, description, price, discountPct, finalPrice, imageUrl, type } = product
  const hasDiscount  = discountPct > 0
  const displayPrice = finalPrice ?? price

  const handleAdd = () => {
    const result = addItem(product, restaurantId, restaurantName)
    if (result?.conflict) {
      toast.error(`Tu carrito tiene productos de "${result.restaurantName}". Vacíalo para pedir de otro restaurante.`, { duration: 4000 })
      return
    }
    toast.success(`${name} agregado`, { icon: '🛒', duration: 1500 })
  }

  return (
    <div className="rmenu-product">
      <div className="rmenu-product-img">
        <img
          src={imageUrl || PLACEHOLDER_DISH}
          alt={name}
          loading="lazy"
          onError={e => { e.target.src = PLACEHOLDER_DISH }}
        />
        {hasDiscount && (
          <span className="rmenu-product-discount">-{discountPct}%</span>
        )}
      </div>
      <div className="rmenu-product-info">
        <div className="rmenu-product-type">
          {type === 'DRINK' ? '🥤' : type === 'COMBO' ? '🍱' : '🍽️'}
        </div>
        <h4 className="rmenu-product-name">{name}</h4>
        {description && <p className="rmenu-product-desc">{description}</p>}
        <div className="rmenu-product-footer">
          <div className="rmenu-product-prices">
            {hasDiscount && (
              <span className="rmenu-product-original">S/ {price.toFixed(2)}</span>
            )}
            <span className="rmenu-product-price">S/ {displayPrice.toFixed(2)}</span>
          </div>
          <button className="rmenu-add-btn" onClick={handleAdd}>
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function RestaurantMenu({ categories, restaurantId, restaurantName }) {
  const [activeCategory, setActiveCategory] = useState(categories?.[0]?.id || null)

  if (!categories || categories.length === 0) {
    return (
      <div className="rmenu-empty">
        <p>Este restaurante aún no ha publicado su menú.</p>
      </div>
    )
  }

  return (
    <div className="rmenu">
      <h2 className="rmenu-title">Menú</h2>
      <div className="rmenu-tabs">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`rmenu-tab ${activeCategory === cat.id ? 'rmenu-tab--active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.name}
            <span className="rmenu-tab-count">{cat.products?.length || 0}</span>
          </button>
        ))}
      </div>
      {categories.map(cat =>
        cat.id === activeCategory && (
          <div key={cat.id} className="rmenu-products">
            {cat.products && cat.products.length > 0
              ? cat.products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    restaurantId={restaurantId}
                    restaurantName={restaurantName}
                  />
                ))
              : <p className="rmenu-cat-empty">No hay productos disponibles.</p>
            }
          </div>
        )
      )}
    </div>
  )
}