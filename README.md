# 🍽️ Antojia — Frontend

Interfaz de usuario del marketplace gastronómico **Antojia**, construida con React 19, Vite y TanStack Query.

---

## 🛠️ Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | UI |
| Vite | 8.x | Bundler y dev server |
| React Router | 7.x | Navegación SPA |
| TanStack Query | 5.x | Fetching, caché y sincronización |
| Auth0 React SDK | 2.x | Autenticación |
| Zustand | 5.x | Estado global (carrito) |
| Lucide React | 1.x | Iconografía |
| Axios | 1.x | Cliente HTTP |
| React Hot Toast | 2.x | Notificaciones |

---

## 📁 Estructura del proyecto

```
frontend/
├── public/
│   ├── favicon.jpeg           # Ícono de la app (logo A)
│   ├── logo.jpeg              # Logo completo Antojia
│   └── _redirects             # Redirects de Netlify para SPA routing
├── src/
│   ├── App.jsx                # Rutas de la aplicación
│   ├── config/api.js          # Instancia Axios + interceptores
│   ├── store/cartStore.js     # Zustand — carrito (localStorage: antojia-cart)
│   ├── hooks/
│   │   ├── useCurrentUser.js
│   │   ├── useRestaurants.js
│   │   ├── useOrders.js
│   │   ├── useRestaurantOrders.js
│   │   ├── useProfile.js
│   │   └── useAdmin.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── RestaurantDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── MyOrders.jsx
│   │   ├── OrderDetail.jsx
│   │   ├── Profile.jsx
│   │   ├── Onboarding.jsx
│   │   ├── BecomeDriver.jsx
│   │   ├── DriverDashboard.jsx
│   │   ├── RestaurantDashboard.jsx
│   │   ├── RegisterRestaurant.jsx
│   │   ├── Callback.jsx
│   │   └── admin/Dashboard.jsx
│   └── components/
│       ├── layout/Navbar.jsx
│       ├── marketplace/RestaurantCard.jsx
│       ├── restaurant/RestaurantHeader.jsx
│       ├── orders/OrderStatusBadge.jsx
│       └── ui/LogoUploader.jsx
└── index.html
```

---

## 🚀 Instalación y desarrollo

### 1. Requisitos previos
- Node.js ≥ 18
- Backend de Antojia corriendo en `localhost:4000`
- Cuenta en [Auth0](https://auth0.com)
- Bucket `logos` en Supabase Storage

### 2. Instalar dependencias
```bash
cd frontend
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

```env
VITE_AUTH0_DOMAIN=dev-xxxx.us.auth0.com
VITE_AUTH0_CLIENT_ID=tu_client_id
VITE_AUTH0_AUDIENCE=https://tu-api-identifier
VITE_AUTH0_REDIRECT_URI=http://localhost:5173/callback

VITE_API_URL=http://localhost:4000

VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 4. Correr en desarrollo
```bash
npm run dev
```
La app inicia en `http://localhost:5173`

---

## 🗺️ Rutas de la aplicación

| Ruta | Componente | Acceso |
|---|---|---|
| `/` | Home | Público |
| `/restaurant/:id` | RestaurantDetail | Público |
| `/cart` | Cart | Público |
| `/checkout` | Checkout | Autenticado |
| `/orders` | MyOrders | Autenticado |
| `/orders/:id` | OrderDetail | Autenticado |
| `/profile` | Profile | Autenticado |
| `/onboarding` | Onboarding | Autenticado |
| `/become-driver` | BecomeDriver | Autenticado |
| `/driver` | DriverDashboard | DELIVERY |
| `/restaurant-dashboard` | RestaurantDashboard | RESTAURANT_OWNER |
| `/register-restaurant` | RegisterRestaurant | Autenticado |
| `/admin` | Dashboard | ADMIN |
| `/callback` | Callback | — |

---

## ⚡ Scripts

```bash
npm run dev      # Desarrollo con HMR
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Lint con ESLint
```

---

## 🚢 Despliegue en producción (Netlify)

### Archivo `public/_redirects` (obligatorio para SPA)

```
/*    /index.html   200
```

Sin este archivo, Netlify devuelve 404 en rutas como `/callback`, `/orders`, etc.

### Variables de entorno en Netlify

Site settings → Environment variables:

```env
VITE_AUTH0_DOMAIN=dev-xxxx.us.auth0.com
VITE_AUTH0_CLIENT_ID=tu_client_id
VITE_AUTH0_AUDIENCE=https://tu-api-identifier
VITE_AUTH0_REDIRECT_URI=https://tu-app.netlify.app/callback
VITE_API_URL=https://tu-backend.onrender.com
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Configuración de build en Netlify

| Campo | Valor |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | `18` |

### Auth0 — URLs permitidas

Dashboard → Applications → tu app → Settings:

```
Allowed Callback URLs:
http://localhost:5173/callback, https://tu-app.netlify.app/callback

Allowed Logout URLs:
http://localhost:5173, https://tu-app.netlify.app

Allowed Web Origins:
http://localhost:5173, https://tu-app.netlify.app
```

> ⚠️ Auth0 requiere HTTPS en producción. Si el sitio se abre por HTTP, lanza el error "auth0-spa-js must run on a secure origin". Netlify habilita HTTPS automáticamente.

> ⚠️ Si usas login con Google, debes configurar tus propias credenciales OAuth en Google Cloud Console y pegarlas en Auth0 → Authentication → Social → Google. Las Dev Keys de Auth0 no funcionan en producción.

---

## 📄 Licencia

Qoribex — Antojia © 2025