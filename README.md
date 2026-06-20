# 🍽️ Antojia — Frontend

Interfaz de usuario del marketplace gastronómico **Antojia**, construida con React 19, Vite y TanStack Query.

---

## 🛠️ Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | UI |
| Vite | 8.x | Bundler y dev server |
| React Router | 7.x | Navegación SPA |
| TanStack Query | 5.x | Fetching, caché y sincronización de datos |
| Auth0 React SDK | 2.x | Autenticación |
| Zustand | 5.x | Estado global (carrito) |
| Lucide React | 1.x | Iconografía |
| React Hot Toast | 2.x | Notificaciones |
| Axios | 1.x | Cliente HTTP |

---

## 📁 Estructura del proyecto

```
frontend/
├── index.html
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx               # Entrada — Auth0Provider, QueryClient, Router
    ├── App.jsx                # Rutas de la aplicación
    ├── config/
    │   └── api.js             # Instancia de Axios + interceptores
    ├── store/
    │   └── cartStore.js       # Zustand — carrito de compras
    ├── hooks/
    │   ├── useCurrentUser.js  # Perfil del usuario autenticado
    │   ├── useOnboarding.js   # Redirección al primer login
    │   ├── useRestaurants.js  # Listado y detalle de restaurantes
    │   ├── useOrders.js       # Pedidos del usuario
    │   ├── useRestaurantOrders.js  # Pedidos del restaurante (owner)
    │   ├── useProfile.js      # Mutaciones del perfil + menú + vehículo
    │   └── useAdmin.js        # Datos del panel admin
    ├── pages/
    │   ├── Home.jsx           # Marketplace principal
    │   ├── RestaurantDetail.jsx  # Detalle + menú de restaurante
    │   ├── Cart.jsx           # Carrito de compras
    │   ├── Checkout.jsx       # Proceso de pago
    │   ├── PaymentResult.jsx  # Retorno de Mercado Pago (success/pending/failure)
    │   ├── MyOrders.jsx       # Historial de pedidos del cliente
    │   ├── OrderDetail.jsx    # Detalle de un pedido (incl. "Verificar pago" para MP)
    │   ├── Profile.jsx        # Perfil editable (usuario / owner / driver)
    │   ├── Onboarding.jsx     # Primer acceso — elegir rol
    │   ├── BecomeDriver.jsx   # Registro de repartidor
    │   ├── DriverDashboard.jsx  # Panel del repartidor
    │   ├── RestaurantDashboard.jsx  # Panel de pedidos del restaurante
    │   ├── RegisterRestaurant.jsx   # Inscripción de restaurante
    │   ├── Callback.jsx       # Callback de Auth0
    │   └── admin/
    │       └── Dashboard.jsx  # Panel administrador
    └── components/
        ├── layout/
        │   └── Navbar.jsx     # Barra de navegación
        ├── marketplace/
        │   └── RestaurantCard.jsx  # Tarjeta de restaurante
        ├── restaurant/
        │   └── RestaurantHeader.jsx  # Header del detalle
        ├── checkout/
        │   ├── OrderTypeSelector.jsx
        │   ├── DeliveryForm.jsx
        │   ├── ReservationForm.jsx
        │   ├── PaymentMethod.jsx   # Yape / Efectivo / Mercado Pago
        │   └── OrderSummary.jsx
        ├── orders/
        │   └── OrderStatusBadge.jsx
        ├── onboarding/
        │   ├── RoleSelector.jsx
        │   └── RestaurantRegisterForm.jsx
        ├── admin/
        │   ├── AdminSidebar.jsx
        │   └── AdminPayments.jsx  # incluye método Mercado Pago
        ├── cart/
        └── ui/
            ├── LogoUploader.jsx   # Subida de logo a Supabase Storage
            └── LogoUploader.css
```

---

## 🚀 Instalación y desarrollo

### 1. Requisitos previos
- Node.js ≥ 18
- Backend de Antojia corriendo en `localhost:4000`
- Cuenta en [Auth0](https://auth0.com)
- Bucket `logos` en Supabase Storage (para subida de logos)

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
# Auth0
VITE_AUTH0_DOMAIN=tu-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=tu_client_id
VITE_AUTH0_AUDIENCE=https://tu-api.com
VITE_AUTH0_REDIRECT_URI=http://localhost:5173/callback

# Backend
VITE_API_URL=http://localhost:4000

# Supabase Storage (para logos de restaurantes)
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> 💡 Mercado Pago no necesita ninguna variable en el frontend — el checkout
> (Checkout Pro) se crea enteramente en el backend; el frontend solo redirige
> a la URL que este le devuelve.

### 4. Correr en desarrollo
```bash
npm run dev
```

La app inicia en `http://localhost:5173`

---

## 🗺️ Rutas de la aplicación

| Ruta | Componente | Acceso |
|---|---|---|
| `/` | `Home` | Público |
| `/restaurant/:id` | `RestaurantDetail` | Público |
| `/cart` | `Cart` | Público |
| `/checkout` | `Checkout` | Autenticado |
| `/payment/success` | `PaymentResult` | Autenticado |
| `/payment/pending` | `PaymentResult` | Autenticado |
| `/payment/failure` | `PaymentResult` | Autenticado |
| `/orders` | `MyOrders` | Autenticado |
| `/orders/:id` | `OrderDetail` | Autenticado |
| `/profile` | `Profile` | Autenticado |
| `/onboarding` | `Onboarding` | Autenticado (primer login) |
| `/become-driver` | `BecomeDriver` | Autenticado |
| `/driver` | `DriverDashboard` | DELIVERY |
| `/restaurant-dashboard` | `RestaurantDashboard` | RESTAURANT_OWNER |
| `/register-restaurant` | `RegisterRestaurant` | Autenticado |
| `/admin` | `Dashboard` | ADMIN |
| `/callback` | `Callback` | — |

---

## 👥 Flujos por rol

### 🛒 Cliente (CONSUMER)
1. Navega el marketplace en `/`
2. Filtra restaurantes por categoría o distrito
3. Entra al detalle y agrega productos al carrito
4. Hace checkout eligiendo delivery o reserva, y un método de pago: **Mercado Pago** (tarjeta), Yape o Efectivo al recibir
5. Si elige Mercado Pago, es redirigido al checkout de MP y vuelve a `/payment/success|pending|failure`, donde se sincroniza el estado real del pago
6. Sigue el estado del pedido en `/orders` — si el pago de Mercado Pago quedó pendiente, puede forzar la verificación con el botón **"Verificar pago"** en el detalle del pedido

### 🍽️ Dueño de Restaurante (RESTAURANT_OWNER)
1. Se registra como dueño en `/register-restaurant`
2. Espera verificación del administrador
3. Edita datos del restaurante en `/profile`
4. Sube el logo del restaurante (se guarda en Supabase Storage)
5. Gestiona su menú (crear, editar, habilitar/deshabilitar platos)
6. Ve y gestiona pedidos entrantes en `/restaurant-dashboard`
7. Cambia el estado de los pedidos: Confirmar → Preparando → Listo

### 🏍️ Repartidor (DELIVERY)
1. Se registra en `/become-driver`
2. Espera verificación del administrador
3. Ve pedidos disponibles en `/driver`
4. Acepta pedidos y actualiza su ubicación
5. Edita su vehículo en `/profile`

### ⚙️ Administrador (ADMIN)
1. Accede al panel en `/admin`
2. Gestiona usuarios, restaurantes, repartidores y pedidos
3. Verifica o suspende restaurantes y repartidores
4. Visualiza métricas e ingresos

---

## 🏪 Gestión del estado

### TanStack Query
Maneja todo el estado del servidor — fetching, caché, revalidación y mutaciones. Claves principales:

```js
['current-user']               // perfil del usuario
['restaurants', filters]       // lista del marketplace
['restaurant', id]             // detalle de restaurante
['restaurant-orders', id]      // pedidos del restaurante (refresca c/ 20s)
['restaurant-products', id]    // menú del restaurante
['orders']                     // pedidos del cliente
['order', id]                  // detalle de un pedido (refresca c/ 15s; "Verificar pago" lo refetchea al instante)
```

### Zustand (cartStore)
Estado del carrito de compras guardado en `localStorage` bajo la clave `antojia-cart`. Persiste entre sesiones.

```js
useCartStore(s => s.items)          // items del carrito
useCartStore(s => s.addItem)        // agregar producto
useCartStore(s => s.removeItem)     // quitar producto
useCartStore(s => s.clearCart)      // vaciar carrito
useCartStore(s => s.getTotalItems)  // total de ítems
useCartStore(s => s.getTotalPrice)  // precio total
```

---

## 📸 Subida de logos

Los logos se suben directamente a **Supabase Storage** desde el browser (sin pasar por el backend):

1. El componente `LogoUploader` hace un `POST` a la API REST de Supabase
2. La imagen se guarda en `logos/restaurants/{restaurantId}_{timestamp}.{ext}`
3. La URL pública resultante se guarda en la BD via `PUT /api/v1/restaurants/:id`

**Configurar el bucket:**
- Nombre: `logos`
- Tipo: público
- Tamaño máximo: 5 MB
- Formatos: `image/png`, `image/jpeg`, `image/webp`

---

## ⚡ Scripts disponibles

```bash
npm run dev      # Desarrollo con HMR
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Lint con ESLint
```

---

## 🚢 Despliegue en producción

### Vercel (recomendado)
```bash
npm run build
# Subir carpeta dist/ a Vercel
```

Variables de entorno en Vercel:
```
VITE_AUTH0_DOMAIN
VITE_AUTH0_CLIENT_ID
VITE_AUTH0_AUDIENCE
VITE_AUTH0_REDIRECT_URI=https://tu-dominio.vercel.app/callback
VITE_API_URL=https://tu-backend.railway.app
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

### Auth0 — Configuración requerida
En el dashboard de Auth0 → Applications → tu app:
- **Allowed Callback URLs:** `http://localhost:5173/callback, https://tu-dominio.vercel.app/callback`
- **Allowed Logout URLs:** `http://localhost:5173, https://tu-dominio.vercel.app`
- **Allowed Web Origins:** `http://localhost:5173, https://tu-dominio.vercel.app`

---

## 📄 Licencia

Proyecto — Qoribex © 2026