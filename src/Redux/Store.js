import {configureStore, createListenerMiddleware, isAnyOf} from '@reduxjs/toolkit'
import productReducer from './productSlice'
import cartReducer from './cartSlice'
import wishListReducer from './wishListSlice'
import authReducer from './authSlice'
import orderReducer from './orderSlice'
import { addToCart, clearCart, incrementCartQuantity, mergeSavedCartItems, removeFromCart, replaceCartItems, setCartQuantity } from './cartSlice'
import { saveCartForUser } from '../Services/cartService'
import { clearFavorites, mergeSavedFavorites, removeFavorite, replaceFavorites, toggleFavorite } from './wishListSlice'
import { saveFavoritesForUser } from '../Services/favoriteService'

const cartPersistence = createListenerMiddleware()
const favoritePersistence = createListenerMiddleware()

cartPersistence.startListening({
    matcher: isAnyOf(addToCart, incrementCartQuantity, setCartQuantity, removeFromCart, clearCart, replaceCartItems, mergeSavedCartItems),
    effect: async function(action, listenerApi) {
        void action
        try {
            const savedUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}')
            const userId = savedUser.id || 'guest'
            await saveCartForUser(userId, listenerApi.getState().cart.items)
        } catch (error) {
            console.error('Could not save cart to the database.', error)
        }
    }
})

favoritePersistence.startListening({
    matcher: isAnyOf(toggleFavorite, removeFavorite, replaceFavorites, mergeSavedFavorites, clearFavorites),
    effect: async function(action, listenerApi) {
        void action
        try {
            const savedUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}')
            const userId = savedUser.id || 'guest'
            await saveFavoritesForUser(userId, listenerApi.getState().wishlist.items)
        } catch (error) {
            console.error('Could not save favorites to the database.', error)
        }
    }
})


const Store=configureStore({
    reducer:{
    products:productReducer,
    cart:cartReducer,
    wishlist:wishListReducer,
    auth:authReducer,
    orders:orderReducer
    },
    middleware:function(getDefaultMiddleware) {
        return getDefaultMiddleware().prepend(cartPersistence.middleware, favoritePersistence.middleware)
    }
})

export default Store
