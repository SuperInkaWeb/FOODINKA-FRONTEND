import RestaurantCard from './RestaurantCard.jsx'
import './RestaurantGrid.css'

// Skeleton de carga
function SkeletonCard() {
  return (
    <div className="rgrid-skeleton">
      <div className="rgrid-skeleton-img" />
      <div className="rgrid-skeleton-body">
        <div className="rgrid-skeleton-line rgrid-skeleton-line--title" />
        <div className="rgrid-skeleton-line" />
        <div className="rgrid-skeleton-line rgrid-skeleton-line--short" />
      </div>
    </div>
  )
}

export default function RestaurantGrid({ restaurants, isLoading, isError, total }) {

  // Estado de carga
  if (isLoading) {
    return (
      <div className="rgrid">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  // Estado de error
  if (isError) {
    return (
      <div className="rgrid-empty">
        <span>😕</span>
        <p>No pudimos cargar los restaurantes.</p>
        <small>Verifica tu conexión e intenta de nuevo.</small>
      </div>
    )
  }

  // Sin resultados
  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="rgrid-empty">
        <span>🍽️</span>
        <p>No encontramos restaurantes con esos filtros.</p>
        <small>Prueba cambiando la categoría o el distrito.</small>
      </div>
    )
  }

  return (
    <div>
      {/* Contador de resultados */}
      <p className="rgrid-count">
        {total ?? restaurants.length} restaurantes encontrados
      </p>

      {/* Grilla */}
      <div className="rgrid">
        {restaurants.map(restaurant => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  )
}