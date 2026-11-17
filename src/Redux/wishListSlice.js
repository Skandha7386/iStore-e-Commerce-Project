import { createSlice } from '@reduxjs/toolkit'

const wishListSlice = createSlice({
    name: 'wishlist',
    initialState: { items: [] },
    reducers: {
        toggleFavorite: function(state, action) {
            const product = action.payload
            const index = state.items.findIndex(function(item) {
                return String(item.id) === String(product.id)
            })
            if (index >= 0) state.items.splice(index, 1)
            else state.items.push(product)
        },
        removeFavorite: function(state, action) {
            state.items = state.items.filter(function(item) {
                return String(item.id) !== String(action.payload)
            })
        },
        replaceFavorites: function(state, action) {
            state.items = action.payload
        },
        mergeSavedFavorites: function(state, action) {
            action.payload.forEach(function(savedItem) {
                const exists = state.items.some(function(item) {
                    return String(item.id) === String(savedItem.id)
                })
                if (!exists) state.items.push(savedItem)
            })
        },
        clearFavorites: function(state) {
            state.items = []
        }
    }
})

export const { toggleFavorite, removeFavorite, replaceFavorites, mergeSavedFavorites, clearFavorites } = wishListSlice.actions
export default wishListSlice.reducer
