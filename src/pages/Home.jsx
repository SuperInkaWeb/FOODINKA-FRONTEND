import { useState } from 'react'
import { useDebounce } from '../hooks/useDebounce.js'
import { useRestaurants } from '../hooks/useRestaurants.js'
import Navbar from '../components/layout/Navbar.jsx'
import SearchBar from '../components/marketplace/SearchBar.jsx'
import CategoryFilter from '../components/marketplace/CategoryFilter.jsx'
import RestaurantGrid from '../components/marketplace/RestaurantGrid.jsx'
import './Home.css'

export default function Home() {
  const [filters, setFilters] = useState({
    category:    '',
    district:    '',
    delivery:    '',
    reservation: '',
    search:      '',
    page:        1,
    limit:       12,
  })

  const debouncedSearch = useDebounce(filters.search, 400)

  const { data, isLoading, isError } = useRestaurants({
    ...filters,
    search: debouncedSearch,
  })

  const restaurants = data?.data               || []
  const total       = data?.pagination?.total  || 0
  const totalPages  = data?.pagination?.totalPages || 1

  const handleFiltersChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1, limit: 12 })
  }

  const handleSearchChange = (value) => {
    setFilters(f => ({ ...f, search: value, page: 1 }))
  }

  return (
    <div className="home">
      <Navbar />

      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-inner">
          <h1 className="home-hero-title">
            Los mejores restaurantes<br />
            <span>de Lima, en un solo lugar</span>
          </h1>
          <p className="home-hero-sub">
            Pide delivery o reserva tu mesa — rápido, fácil y sin comisiones abusivas
          </p>
          <SearchBar
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
      </section>

      {/* Contenido principal */}
      <main className="home-main">

        <CategoryFilter
          filters={filters}
          onChange={handleFiltersChange}
        />

        <div className="home-grid-wrap">
          <RestaurantGrid
            restaurants={restaurants}
            isLoading={isLoading}
            isError={isError}
            total={total}
          />

          {/* Paginación */}
          {!isLoading && totalPages > 1 && (
            <div className="home-pagination">
              <button
                className="home-page-btn"
                onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                disabled={filters.page <= 1}
              >
                ← Anterior
              </button>
              <span className="home-page-info">
                Página {filters.page} de {totalPages}
              </span>
              <button
                className="home-page-btn"
                onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                disabled={filters.page >= totalPages}
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}