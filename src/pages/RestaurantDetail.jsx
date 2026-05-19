import { useParams } from 'react-router-dom'
import { useRestaurant } from '../hooks/useRestaurants.js'
import { useCartStore } from '../store/cartStore.js'
import Navbar from '../components/layout/Navbar.jsx'
import RestaurantHeader from '../components/restaurant/RestaurantHeader.jsx'
import RestaurantInfo from '../components/restaurant/RestaurantInfo.jsx'
import RestaurantMenu from '../components/restaurant/RestaurantMenu.jsx'
import './RestaurantDetail.css'

export default function RestaurantDetail() {
  const { id } = useParams()
  const { data, isLoading, isError } = useRestaurant(id)
  const restaurant  = data?.data
  const totalItems  = useCartStore(s => s.getTotalItems())

  if (isLoading) return (
    <div className="rdetail">
      <Navbar cartCount={totalItems} />
      <div className="rdetail-skeleton">
        <div className="rdetail-skeleton-hero" />
        <div className="rdetail-skeleton-body">
          <div className="rdetail-skeleton-line rdetail-skeleton-line--title" />
          <div className="rdetail-skeleton-line" />
          <div className="rdetail-skeleton-line rdetail-skeleton-line--short" />
        </div>
      </div>
    </div>
  )

  if (isError || !restaurant) return (
    <div className="rdetail">
      <Navbar cartCount={totalItems} />
      <div className="rdetail-error">
        <span>😕</span>
        <p>No pudimos cargar este restaurante.</p>
      </div>
    </div>
  )

  return (
    <div className="rdetail">
      <Navbar cartCount={totalItems} />
      <RestaurantHeader restaurant={restaurant} />
      <div className="rdetail-content">
        <RestaurantInfo restaurant={restaurant} />
        <RestaurantMenu
          categories={restaurant.categories}
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
        />
      </div>
    </div>
  )
}