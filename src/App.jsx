import { Routes, Route } from 'react-router-dom'
import { useOnboarding } from './hooks/useOnboarding.js'
import Home             from './pages/Home.jsx'
import Callback         from './pages/Callback.jsx'
import RestaurantDetail from './pages/RestaurantDetail.jsx'
import Cart             from './pages/Cart.jsx'
import Checkout         from './pages/Checkout.jsx'
import Onboarding       from './pages/Onboarding.jsx'
import Dashboard        from './pages/admin/Dashboard.jsx'

function AppRoutes() {
  useOnboarding()
  return (
    <Routes>
      <Route path="/"               element={<Home />} />
      <Route path="/callback"       element={<Callback />} />
      <Route path="/restaurant/:id" element={<RestaurantDetail />} />
      <Route path="/cart"           element={<Cart />} />
      <Route path="/checkout"       element={<Checkout />} />
      <Route path="/onboarding"     element={<Onboarding />} />
      <Route path="/admin"          element={<Dashboard />} />
    </Routes>
  )
}

export default function App() {
  return <AppRoutes />
}