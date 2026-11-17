import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Heart, ShoppingCart, Zap } from 'lucide-react'
import { fetchProducts } from '../Redux/productSlice'
import { addToCart, MAX_CART_ITEMS } from '../Redux/cartSlice'
import { toggleFavorite } from '../Redux/wishListSlice'

function ProductDetails() {
    const [cartLimitMessage, setCartLimitMessage] = useState('')
    const isLoggedIn = Boolean(localStorage.getItem("loggedInUser"))
    const { id } = useParams()
    const dispatch = useDispatch()
    const { products, isLoading, error } = useSelector(function(state) {
        return state.products
    })
    const cartItems = useSelector(function(state) { return state.cart.items })
    const favoriteItems = useSelector(function(state) { return state.wishlist.items })
    const navigate = useNavigate()

    useEffect(function() {
        if (products.length === 0) {
            dispatch(fetchProducts())
        }
    }, [dispatch, products.length])

    if (isLoading) {
        return <h2>Loading product...</h2>
    }

    if (error) {
        return <h2>{error}</h2>
    }

    const product = products.find(function(item) {
        return String(item.id) === id
    })

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-5 py-12">
                <h2>Product not found</h2>
                <Link to="/products">Back to products</Link>
            </div>
        )
    }

    const isFavorite = favoriteItems.some(function(item) {
        return String(item.id) === String(product.id)
    })
    const cartQuantity = cartItems.reduce(function(total, item) {
        return String(item.product.id) === String(product.id) ? total + item.quantity : total
    }, 0)
    const cartTotal = cartItems.reduce(function(total, item) { return total + item.quantity }, 0)

    function handleAddToCart() {
        if (cartQuantity > 0) navigate('/cart')
        else if (cartTotal >= MAX_CART_ITEMS) setCartLimitMessage(`Your cart is limited to ${MAX_CART_ITEMS} items.`)
        else dispatch(addToCart(product))
    }

    function handleBuyNow() {
        if (cartQuantity === 0 && cartTotal >= MAX_CART_ITEMS) {
            setCartLimitMessage(`Your cart is limited to ${MAX_CART_ITEMS} items.`)
            return
        }

        if (!isLoggedIn) {
            navigate('/login', {
                state: {
                    from: { pathname: '/checkout' },
                    buyNowProduct: product
                }
            })
            return
        }

        dispatch(addToCart(product))
        navigate('/checkout')
    }

    return (
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="bg-[#f5f5f7] rounded-3xl p-8 h-80 md:h-[500px] flex items-center justify-center">
                    <img
                        src={product.image.startsWith('http') || product.image.startsWith('/')
                            ? product.image
                            : `/Images/${product.image}`}
                        alt={product.name}
                        onError={function(event) {
                            event.target.onerror = null
                            event.target.src = 'https://placehold.co/600x600?text=Product'
                        }}
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                </div>

                <div>
                    <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                    <h1 className="text-3xl md:text-5xl font-semibold text-gray-900">
                        {product.name}
                    </h1>
                    <p className="text-2xl font-medium mt-6">
                        {Number.isFinite(product.price) ? `₹${product.price.toLocaleString('en-IN')}` : 'Price not set'}
                    </p>
                    <p className="text-gray-600 mt-6">{product.description}</p>
                    <p className="text-sm text-gray-500 mt-4">
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </p>
                    <div className="mt-7 flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={function() { dispatch(toggleFavorite(product)) }}
                            aria-pressed={isFavorite}
                            className={`flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition ${isFavorite ? 'border-rose-600 text-rose-600' : 'border-gray-300 text-gray-800 hover:border-black'}`}
                        >
                            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                            {isFavorite ? 'Favorited' : 'Add to Favorites'}
                        </button>
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className="flex items-center justify-center gap-2 rounded-full bg-[#0071e3] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#0077ed]"
                        >
                            <ShoppingCart size={18} />
                            {cartQuantity > 0 ? 'Go to Cart' : 'Add to Cart'}
                        </button>
                        <button
                            type="button"
                            onClick={handleBuyNow}
                            className="flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                        >
                            <Zap size={18} /> {isLoggedIn ? 'Buy Now' : 'Login to Proceed'}
                        </button>
                    </div>
                    {cartLimitMessage && <p role="alert" className="mt-3 text-sm text-amber-700">{cartLimitMessage}</p>}
                    <Link
                        to="/products"
                        className="inline-block mt-8 text-[#0071e3] hover:underline"
                    >
                        Back to products
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails
