import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { incrementCartQuantity, MAX_CART_ITEMS, MAX_QUANTITY_PER_PRODUCT, mergeSavedCartItems, removeFromCart, setCartQuantity } from '../Redux/cartSlice'
import { getCartForUser } from '../Services/cartService'

function getImagePath(image) {
    return image.startsWith('/') ? image : `/Images/${image}`
}

function formatPrice(price) {
    return Number.isFinite(price) ? `₹${price.toLocaleString('en-IN')}` : 'Price not set'
}

function Cart() {
    const dispatch = useDispatch()
    const items = useSelector(function(state) { return state.cart.items })
    const userId = JSON.parse(localStorage.getItem('loggedInUser') || '{}').id || 'guest'

    useEffect(function() {
        if (items.length > 0) return
        let active = true
        getCartForUser(userId)
            .then(function(savedItems) {
                if (active && savedItems.length > 0) dispatch(mergeSavedCartItems(savedItems))
            })
            .catch(function() {})
        return function() { active = false }
    }, [dispatch, userId])

    const total = items.reduce(function(sum, item) {
        return sum + (Number.isFinite(item.product.price) ? item.product.price * item.quantity : 0)
    }, 0)

    if (items.length === 0) {
        return (
            <main className="mx-auto max-w-5xl px-5 py-20 text-center">
                <h1 className="text-3xl font-semibold text-gray-900">Your bag is empty.</h1>
                <p className="mt-3 text-gray-500">Add products to your bag and they’ll appear here.</p>
                <Link to="/products" className="mt-7 inline-block rounded-full bg-[#0071e3] px-6 py-3 text-sm font-medium text-white">Continue shopping</Link>
            </main>
        )
    }

    return (
        <main className="mx-auto max-w-5xl px-5 py-12">
            <h1 className="text-3xl font-semibold text-gray-900">Your Bag</h1>
            <p className="mt-2 text-sm text-gray-500">Limit: {MAX_CART_ITEMS} items total, up to {MAX_QUANTITY_PER_PRODUCT} of each product.</p>
            <div className="mt-8 divide-y divide-gray-200">
                {items.map(function(entry) {
                    const product = entry.product
                    return (
                        <article key={product.id} className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center">
                            <Link to={`/products/${product.id}`} className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-[#f5f5f7] p-3">
                                <img src={getImagePath(product.image)} alt={product.name} className="max-h-full max-w-full object-contain" />
                            </Link>
                            <div className="min-w-0 flex-1">
                                <Link to={`/products/${product.id}`} className="font-semibold text-gray-900 hover:underline">{product.name}</Link>
                                <p className="mt-1 text-sm text-gray-500">{product.accessoryType || product.category}</p>
                                <p className="mt-2 text-sm font-medium text-gray-800">{formatPrice(product.price)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button type="button" aria-label={`Decrease ${product.name} quantity`} onClick={function() { if (entry.quantity > 1) dispatch(setCartQuantity({ id: product.id, quantity: entry.quantity - 1 })) }} className="h-9 w-9 rounded-full border border-gray-300">−</button>
                                <span className="min-w-5 text-center">{entry.quantity}</span>
                                <button type="button" aria-label={`Increase ${product.name} quantity`} disabled={entry.quantity >= MAX_QUANTITY_PER_PRODUCT || items.reduce(function(sum, item) { return sum + item.quantity }, 0) >= MAX_CART_ITEMS} onClick={function() { dispatch(incrementCartQuantity(product.id)) }} className="h-9 w-9 rounded-full border border-gray-300 disabled:cursor-not-allowed disabled:opacity-40">+</button>
                            </div>
                            <button type="button" onClick={function() { dispatch(removeFromCart(product.id)) }} className="text-sm text-gray-500 hover:text-red-600">Remove</button>
                        </article>
                    )
                })}
            </div>
            <div className="mt-8 flex flex-col items-end border-t border-gray-200 pt-6">
                <p className="text-lg font-semibold text-gray-900">Subtotal: ₹{total.toLocaleString('en-IN')}</p>
                <p className="mt-1 text-xs text-gray-500">Products without a set price are excluded from the subtotal.</p>
                <Link to="/checkout" className="mt-5 rounded-full bg-[#0071e3] px-6 py-3 text-sm font-medium text-white hover:bg-[#0077ed]">Continue to Checkout</Link>
            </div>
        </main>
    )
}

export default Cart
