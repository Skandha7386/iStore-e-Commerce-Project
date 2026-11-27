import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Heart, ShoppingCart, X } from 'lucide-react'
import { addToCart, MAX_CART_ITEMS } from '../Redux/cartSlice'
import { mergeSavedFavorites, removeFavorite } from '../Redux/wishListSlice'
import { getFavoritesForUser } from '../Services/favoriteService'

function getImagePath(image) {
    return image.startsWith('/') ? image : `/Images/${image}`
}

function formatPrice(price) {
    return Number.isFinite(price) ? `₹${price.toLocaleString('en-IN')}` : 'Price not set'
}

export default function Wishlist() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const items = useSelector(function(state) { return state.wishlist.items })
    const cartItems = useSelector(function(state) { return state.cart.items })
    const cartTotal = cartItems.reduce(function(total, entry) { return total + entry.quantity }, 0)
    const shouldLoadSavedFavorites = useRef(items.length === 0)
    const [isLoadingFavorites, setIsLoadingFavorites] = useState(shouldLoadSavedFavorites.current)
    const userId = JSON.parse(localStorage.getItem('loggedInUser') || '{}').id || 'guest'

    useEffect(function() {
        if (!shouldLoadSavedFavorites.current) return
        let active = true
        getFavoritesForUser(userId)
            .then(function(savedItems) {
                if (active && savedItems.length > 0) dispatch(mergeSavedFavorites(savedItems))
            })
            .catch(function() {})
            .finally(function() {
                if (active) setIsLoadingFavorites(false)
            })
        return function() { active = false }
    }, [dispatch, userId])

    if (isLoadingFavorites) {
        return <main className="mx-auto max-w-5xl px-5 py-20 text-center text-gray-500">Loading favorites...</main>
    }

    if (items.length === 0) {
        return (
            <main className="mx-auto max-w-5xl px-5 py-20 text-center">
                <Heart size={32} className="mx-auto text-gray-400" />
                <h1 className="mt-4 text-3xl font-semibold text-gray-900">Your favorites are empty.</h1>
                <p className="mt-3 text-gray-500">Save products you like and find them here.</p>
                <Link to="/products" className="mt-7 inline-block rounded-full bg-[#0071e3] px-6 py-3 text-sm font-medium text-white">Explore products</Link>
            </main>
        )
    }

    return (
        <main className="mx-auto max-w-6xl px-5 py-12">
            <h1 className="text-3xl font-semibold text-gray-900">Your Favorites</h1>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map(function(product) {
                    return (
                        <article key={product.id} className="flex flex-col rounded-3xl bg-[#f5f5f7] p-5">
                            <Link to={`/products/${product.id}`} className="flex h-52 items-center justify-center">
                                <img src={getImagePath(product.image)} alt={product.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                            </Link>
                            <p className="mt-4 text-xs text-gray-500">{product.accessoryType || product.category}</p>
                            <Link to={`/pro ducts/${product.id}`} className="mt-1 text-lg font-semibold text-gray-900 hover:underline">{product.name}</Link>
                            <p className="mt-2 font-medium text-gray-800">{formatPrice(product.price)}</p>
                            <div className="mt-5 flex gap-2">
                                <button type="button" onClick={function() {
                                    const alreadyInCart = cartItems.some(function(entry) {
                                        return String(entry.product.id) === String(product.id)
                                    })
                                    if (alreadyInCart) navigate('/cart')
                                    else dispatch(addToCart(product))
                                }} disabled={cartTotal >= MAX_CART_ITEMS && !cartItems.some(function(entry) { return String(entry.product.id) === String(product.id) })} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0071e3] py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50">
                                    <ShoppingCart size={16} />
                                    {cartItems.some(function(entry) { return String(entry.product.id) === String(product.id) }) ? 'Go to Cart' : cartTotal >= MAX_CART_ITEMS ? 'Cart Full' : 'Add to Cart'}
                                </button>
                                <button type="button" aria-label={`Remove ${product.name} from favorites`} onClick={function() { dispatch(removeFavorite(product.id)) }} className="rounded-full border border-gray-300 px-4 text-gray-600 hover:text-red-600">
                                    <X size={18} />
                                </button>
                            </div>
                        </article>
                    )
                })}
            </div>
        </main>
    )
}
