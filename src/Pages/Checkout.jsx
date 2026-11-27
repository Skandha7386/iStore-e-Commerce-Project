import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart ,addToCart} from '../Redux/cartSlice'
import { submitOrder } from '../Redux/orderSlice'
import { updateProductStock } from '../Services/productService'
import { fetchProducts, productStocksUpdated } from '../Redux/productSlice'
import { Heart } from 'lucide-react'
import { toggleFavorite } from '../Redux/wishListSlice'

function getSavedCustomer() {
    try {
        return {
            ...JSON.parse(localStorage.getItem('istore-profile') || '{}'),
            ...JSON.parse(localStorage.getItem('loggedInUser') || '{}')
        }
    } catch {
        return {}
    }
}

function Checkout() {
    const dispatch = useDispatch()
    const items = useSelector(function(state) { return state.cart.items })
    const products = useSelector(function(state) { return state.products.products })
    const productsLoading = useSelector(function(state) { return state.products.isLoading })
    const productsError = useSelector(function(state) { return state.products.error })
    const isCreatingOrder = useSelector(function(state) { return state.orders.isCreating })
    const wishlistItems = useSelector(function(state) {
    return state.wishlist.items
})  
    const savedCustomer = getSavedCustomer()
    const [customer, setCustomer] = useState({
        name: savedCustomer.name || '',
        email: savedCustomer.email || '',
        phone: savedCustomer.phone || '', 
        address: savedCustomer.address || ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery')
    const [error, setError] = useState('')
    const [order, setOrder] = useState(null)

    const total = items.reduce(function(sum, entry) {
        return sum + (Number.isFinite(entry.product.price) ? entry.product.price * entry.quantity : 0)
    }, 0)
    const hasUnsetPrice = items.some(function(entry) {
        return !Number.isFinite(entry.product.price)
    })

    const recommendedProducts = products
    .filter(function(product) {
        return !items.some(function(entry) {
            return String(entry.product.id) === String(product.id)
        })
    })
    .slice(0, 4)

    useEffect(function() {
        dispatch(fetchProducts())
    }, [dispatch])

    function updateCustomer(event) {
        const value = event.target.name === 'phone'
            ? event.target.value.replace(/\D/g, '').slice(0, 10)
            : event.target.value
        setCustomer({ ...customer, [event.target.name]: value })
    }

    async function placeOrder(event) {
        event.preventDefault()
        setError('')

        if (!/^[0-9]{10}$/.test(customer.phone)) {
            setError('Enter a valid 10-digit phone number.')
            return
        }

        setIsSubmitting(true)
        const stockChanges = []

        try {
            const savedUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}')
            const latestItems = items.map(function(entry) {
                const currentProduct = products.find(function(product) {
                    return String(product.id) === String(entry.product.id)
                }) || entry.product
                return { entry: entry, product: currentProduct }
            })

            const outOfStockItem = latestItems.find(function(item) {
                return !Number.isFinite(item.product.stock) || item.product.stock < item.entry.quantity
            })
            if (outOfStockItem) {
                throw new Error(`Not enough stock for ${outOfStockItem.product.name}.`)
            }

            const updates = latestItems.map(function(item) {
                return {
                    id: item.product.id,
                    previousStock: item.product.stock,
                    stock: item.product.stock - item.entry.quantity
                }
            })

            for (const update of updates) {
                await updateProductStock(update.id, update.stock)
                stockChanges.push(update)
            }

            let createdOrder
            try {
                createdOrder = await dispatch(submitOrder({
                userId: savedUser.id,
                customer: customer,
                items: items.map(function(entry) {
                    return {
                        productId: entry.product.id,
                        name: entry.product.name,
                        price: entry.product.price,
                        quantity: entry.quantity
                    }
                }),
                total: total,
                paymentMethod: paymentMethod,
                status: 'placed',
                createdAt: new Date().toISOString()
                })).unwrap()
            } catch (orderError) {
                await Promise.all(stockChanges.map(function(change) {
                    return updateProductStock(change.id, change.previousStock).catch(function() {})
                }))
                stockChanges.length = 0
                throw orderError
            }

            dispatch(productStocksUpdated(stockChanges.map(function(change) {
                return { id: change.id, stock: change.stock }
            })))
            setOrder(createdOrder)
            dispatch(clearCart())
        } catch (orderError) {
            if (stockChanges.length > 0) {
                await Promise.all(stockChanges.map(function(change) {
                    return updateProductStock(change.id, change.previousStock).catch(function() {})
                }))
            }
            setError(typeof orderError === 'string'
                ? orderError
                : orderError.message || 'Could not place the order. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

   if (order) {
    return (
        <main className="relative mx-auto min-h-screen w-full overflow-hidden px-5 py-16">

            {/* Confetti animation */}
            <div className="order-confetti" aria-hidden="true">
                {Array.from({ length: 60 }, function(_, index) {
                    return (
                        <span
                            key={index}
                            className="order-confetti-piece"
                            style={{
                                '--confetti-left': `${(index * 37) % 100}%`,
                                '--confetti-delay': `${(index % 12) * 0.04}s`,
                                '--confetti-duration': `${2.8 + (index % 5) * 0.2}s`,
                                '--confetti-drift': `${((index * 17) % 160) - 80}px`,
                                '--confetti-color': `hsl(${(index * 47) % 360} 90% 60%)`,
                                '--confetti-rotation': `${index * 53}deg`
                            }}
                        />
                    )
                })}
            </div>

            {/* Order confirmation */}
            <div className="relative z-10 mx-auto max-w-3xl text-center">

                <p className="text-sm font-medium text-green-700">
                    Order confirmed
                </p>

                <h1 className="mt-3 text-3xl font-semibold text-gray-900">
                    Thank you for your order.
                </h1>

                <p className="mt-3 text-gray-500">
                    Order number: {order.id}
                </p>

                <Link
                    to="/products"
                    className="mt-7 inline-block rounded-full bg-[#0071e3] px-6 py-3 text-sm font-medium text-white"
                >
                    Continue shopping
                </Link>

            </div>

            {/* Recommended Products */}
            <section className="relative z-10 mx-auto mt-20 w-full max-w-7xl">

                <h2 className="text-2xl font-semibold text-gray-900">
                    You May Also Like
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                    Discover more products you might love.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                    {recommendedProducts.map(function(product) {
                        const isInCart = items.some(function(entry) {
    return String(entry.product.id) === String(product.id)
})
                const isWishlisted = wishlistItems.some(function(item) {
                 return String(item.id) === String(product.id)
    })
                        return (

                            <div
                                key={product.id}
                                className="rounded-2xl bg-[#f5f5f7] p-5 transition hover:shadow-md"
                            >
                                <Link to={`/products/${product.id}`}>

                                  <div className="relative flex h-48 items-center justify-center">

    <img
        src={product.image.startsWith('/')
            ? product.image
            : `/Images/${product.image}`}
        alt={product.name}
        className="max-h-full max-w-full object-contain"
    />

    <button
        type="button"
        onClick={function(event) {
            event.preventDefault()
            event.stopPropagation()
            dispatch(toggleFavorite(product))
        }}
        className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-md transition hover:scale-110"
    >
        <Heart
            size={21}
            color={isWishlisted ? 'red' : 'black'}
            fill={isWishlisted ? 'red' : 'none'}
        />
    </button>

</div>

                                    <h3 className="mt-4 font-medium text-gray-900">
                                        {product.name}
                                    </h3>

                                </Link>

                                <p className="mt-2 font-semibold text-gray-900">
                                    ₹{Number(product.price || 0).toLocaleString('en-IN')}
                                </p>

                              <button
    type="button"
    onClick={function() {
        dispatch(addToCart(product))
    }}
    disabled={isInCart || items.length >= 10}
    className="mt-4 w-full rounded-full bg-[#0071e3] py-2.5 text-sm font-medium text-white transition hover:bg-[#0077ed] disabled:cursor-not-allowed disabled:opacity-50"
>
    {isInCart
        ? 'Already in Cart'
        : items.length >= 10
            ? 'Cart Full'
            : 'Add to Cart'}
</button>

                            </div>
                        )
                    })}

                </div>

            </section>

        </main>
    )
}

    if (items.length === 0) {
        return (
            <main className="mx-auto max-w-3xl px-5 py-20 text-center">
                <h1 className="text-3xl font-semibold text-gray-900">Your bag is empty.</h1>
                <p className="mt-3 text-gray-500">Add a product before checking out.</p>
                <Link to="/products" className="mt-7 inline-block rounded-full bg-[#0071e3] px-6 py-3 text-sm font-medium text-white">Shop products</Link>
            </main>
        )
    }

    return (
        <main className="mx-auto max-w-6xl px-5 py-12">
            <p className="text-sm text-gray-500">Checkout</p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900">Review your order.</h1>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
                <form id="checkout-form" onSubmit={placeOrder} className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
                    <h2 className="text-xl font-semibold text-gray-900">Delivery details</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <input name="name" value={customer.name} onChange={updateCustomer} required placeholder="Full name" autoComplete="name" className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black" />
                        <input name="email" type="email" value={customer.email} onChange={updateCustomer} required placeholder="Email address" autoComplete="email" className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black" />
                        <input name="phone" type="tel" value={customer.phone} onChange={updateCustomer} required pattern="[0-9]{10}" minLength="10" maxLength="10" inputMode="numeric" title="Enter a 10-digit phone number." placeholder="10-digit phone number" autoComplete="tel" className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black sm:col-span-2" />
                        <textarea name="address" value={customer.address} onChange={updateCustomer} required rows="3" placeholder="Delivery address" autoComplete="street-address" className="resize-y rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black sm:col-span-2" />
                    </div>
                    <fieldset className="mt-7">
                        <legend className="text-lg font-semibold text-gray-900">Payment method</legend>
                        <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#0071e3] bg-blue-50 p-4">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cash_on_delivery"
                                checked={paymentMethod === 'cash_on_delivery'}
                                onChange={function() { setPaymentMethod('cash_on_delivery') }}
                                className="mt-1 accent-[#0071e3]"
                            />
                            <span>
                                <span className="block font-medium text-gray-900">Cash on Delivery</span>
                                <span className="mt-1 block text-sm text-gray-600">Pay when your order arrives.</span>
                            </span>
                        </label>
                    </fieldset>
                    {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
                </form>

                <aside className="h-fit rounded-3xl bg-[#f5f5f7] p-6">
                    <h2 className="text-lg font-semibold text-gray-900">Your order</h2>
                    <div className="mt-4 divide-y divide-gray-200">
                        {items.map(function(entry) {
                            return (
                                <div key={entry.product.id} className="flex justify-between gap-4 py-3 text-sm">
                                    <span className="text-gray-700">{entry.product.name} × {entry.quantity}</span>
                                    <span className="shrink-0 font-medium text-gray-900">{Number.isFinite(entry.product.price) ? `₹${(entry.product.price * entry.quantity).toLocaleString('en-IN')}` : 'Price not set'}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="mt-4 flex justify-between border-t border-gray-300 pt-4 font-semibold text-gray-900">
                        <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    {hasUnsetPrice && <p className="mt-3 text-xs text-amber-700">Set prices for all products before placing this order.</p>}
                    {productsError && <p role="alert" className="mt-3 text-xs text-red-600">Could not load current stock. Refresh and try again.</p>}
                    <button type="submit" form="checkout-form" disabled={isSubmitting || isCreatingOrder || hasUnsetPrice || productsLoading || products.length === 0 || Boolean(productsError)} className="mt-6 w-full rounded-full bg-[#0071e3] py-3 text-sm font-medium text-white hover:bg-[#0077ed] disabled:cursor-not-allowed disabled:opacity-50">
                        {isSubmitting || isCreatingOrder ? 'Placing order…' : 'Place order'}
                    </button>
                    <Link to="/cart" className="mt-4 block text-center text-sm text-[#0071e3] hover:underline">Return to bag</Link>
                </aside>
            </div>
       
        </main>
    )
}

export default Checkout
