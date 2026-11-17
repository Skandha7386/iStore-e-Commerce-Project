import { createSlice } from '@reduxjs/toolkit'

export const MAX_CART_ITEMS = 10
export const MAX_QUANTITY_PER_PRODUCT = 5

function getCartItemCount(items) {
    return items.reduce(function(total, item) {
        return total + item.quantity
    }, 0)
}

function normalizeCartItems(items) {
    const normalized = []
    let remaining = MAX_CART_ITEMS

    items.forEach(function(entry) {
        if (remaining <= 0) return
        const existing = normalized.find(function(item) {
            return String(item.product.id) === String(entry.product.id)
        })
        const quantity = Number(entry.quantity) || 0
        const existingQuantity = existing ? existing.quantity : 0
        const acceptedQuantity = Math.min(
            quantity,
            MAX_QUANTITY_PER_PRODUCT - existingQuantity,
            remaining
        )
        if (acceptedQuantity <= 0) return

        if (existing) existing.quantity += acceptedQuantity
        else normalized.push({ product: entry.product, quantity: acceptedQuantity })
        remaining -= acceptedQuantity
    })

    return normalized
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: { items: [] },
    reducers: {
        addToCart: function(state, action) {
            const product = action.payload
            const existingItem = state.items.find(function(item) {
                return String(item.product.id) === String(product.id)
            })
            if (!existingItem && getCartItemCount(state.items) < MAX_CART_ITEMS) {
                state.items.push({ product: product, quantity: 1 })
            }
        },
        incrementCartQuantity: function(state, action) {
            const item = state.items.find(function(entry) {
                return String(entry.product.id) === String(action.payload)
            })
            if (item && item.quantity < MAX_QUANTITY_PER_PRODUCT && getCartItemCount(state.items) < MAX_CART_ITEMS) {
                item.quantity += 1
            }
        },
        setCartQuantity: function(state, action) {
            const { id, quantity } = action.payload
            const item = state.items.find(function(entry) {
                return String(entry.product.id) === String(id)
            })
            if (item && quantity > 0) {
                const otherItemsCount = getCartItemCount(state.items) - item.quantity
                const maximumQuantity = Math.min(MAX_QUANTITY_PER_PRODUCT, MAX_CART_ITEMS - otherItemsCount)
                item.quantity = Math.min(quantity, maximumQuantity)
            }
        },
        removeFromCart: function(state, action) {
            state.items = state.items.filter(function(item) {
                return String(item.product.id) !== String(action.payload)
            })
        },
        clearCart: function(state) {
            state.items = []
        },
        replaceCartItems: function(state, action) {
            state.items = normalizeCartItems(action.payload)
        },
        mergeSavedCartItems: function(state, action) {
            const merged = state.items.map(function(item) {
                return { product: item.product, quantity: item.quantity }
            })
            action.payload.forEach(function(savedItem) {
                const existing = merged.find(function(item) {
                    return String(item.product.id) === String(savedItem.product.id)
                })
                if (existing) {
                    existing.quantity = Math.max(existing.quantity, savedItem.quantity)
                } else {
                    merged.push(savedItem)
                }
            })
            state.items = normalizeCartItems(merged)
        }
    }
})

export const { addToCart, incrementCartQuantity, setCartQuantity, removeFromCart, clearCart, replaceCartItems, mergeSavedCartItems } = cartSlice.actions
export default cartSlice.reducer
