import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items:        [],      // { product, quantity, restaurantId, restaurantName }
      restaurantId: null,    // solo se puede pedir de un restaurante a la vez
      restaurantName: null,

      // ── Agregar producto ────────────────────────────────────
      addItem: (product, restaurantId, restaurantName) => {
        const { items, restaurantId: currentRestaurant } = get()

        // Si el carrito tiene productos de otro restaurante, avisar
        if (currentRestaurant && currentRestaurant !== restaurantId) {
          return { conflict: true, restaurantName: get().restaurantName }
        }

        // Si el producto ya está en el carrito, aumentar cantidad
        const exists = items.find(i => i.product.id === product.id)
        if (exists) {
          set({
            items: items.map(i =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          })
        } else {
          set({
            items: [...items, { product, quantity: 1, restaurantId }],
            restaurantId,
            restaurantName,
          })
        }
        return { conflict: false }
      },

      // ── Aumentar cantidad ───────────────────────────────────
      increment: (productId) => {
        set(state => ({
          items: state.items.map(i =>
            i.product.id === productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }))
      },

      // ── Disminuir cantidad ──────────────────────────────────
      decrement: (productId) => {
        const { items } = get()
        const item = items.find(i => i.product.id === productId)
        if (!item) return

        if (item.quantity === 1) {
          // Si llega a 0, eliminar del carrito
          get().removeItem(productId)
        } else {
          set({
            items: items.map(i =>
              i.product.id === productId
                ? { ...i, quantity: i.quantity - 1 }
                : i
            ),
          })
        }
      },

      // ── Eliminar producto ───────────────────────────────────
      removeItem: (productId) => {
        const newItems = get().items.filter(i => i.product.id !== productId)
        set({
          items: newItems,
          ...(newItems.length === 0 && { restaurantId: null, restaurantName: null }),
        })
      },

      // ── Vaciar carrito ──────────────────────────────────────
      clearCart: () => set({ items: [], restaurantId: null, restaurantName: null }),

      // ── Getters computados ──────────────────────────────────
      getTotalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((acc, i) => {
          const price = i.product.finalPrice ?? i.product.price
          return acc + price * i.quantity
        }, 0),
    }),
    {
      name: 'antojia-cart', // clave en localStorage
    }
  )
)
