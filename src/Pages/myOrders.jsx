import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { cancelOrder, clearCancelError, fetchOrdersForUser } from '../Redux/orderSlice'
import { fetchProducts } from '../Redux/productSlice'

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('loggedInUser') || '{}')
    } catch {
        return {}
    }
}

function MyOrders() {
    const dispatch = useDispatch()
    const user = getCurrentUser()
    const { orders, isLoading, error, cancelError, cancellingOrderId } = useSelector(function(state) {
        return state.orders
    })
    const [orderToCancel, setOrderToCancel] = useState(null)

    useEffect(function() {
        dispatch(fetchOrdersForUser(user.id))
    }, [dispatch, user.id])

    async function handleCancelOrder(order) {
        if (order.status !== 'placed' || cancellingOrderId) return
        const result = await dispatch(cancelOrder(order.id))
        if (cancelOrder.fulfilled.match(result)) {
            dispatch(fetchProducts())
            setOrderToCancel(null)
        }
    }

    return (
        <main className="mx-auto max-w-5xl px-5 py-12">
            <p className="text-sm text-gray-500">Account</p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900">My Orders</h1>
            {isLoading && <p className="py-12 text-center text-gray-500">Loading your orders...</p>}
            {error && <p role="alert" className="py-12 text-center text-red-600">{error}</p>}
            {!isLoading && !error && orders.length === 0 && (
                <div className="mt-8 rounded-3xl bg-[#f5f5f7] px-6 py-14 text-center">
                    <p className="text-lg font-medium text-gray-900">You haven’t placed any orders yet.</p>
                    <Link to="/products" className="mt-5 inline-block rounded-full bg-[#0071e3] px-6 py-3 text-sm font-medium text-white">Explore products</Link>
                </div>
            )}
            {!isLoading && !error && orders.length > 0 && (
                <div className="mt-8 grid gap-5">
                    {orders.map(function(order) {
                        return (
                            <article key={order.id} className="rounded-3xl border border-gray-200 bg-white p-6">
                                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
                                    <div>
                                        <h2 className="font-semibold text-gray-900">Order #{order.id}</h2>
                                        <p className="mt-1 text-sm text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date unavailable'}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${order.status === 'cancelled' ? 'bg-gray-100 text-gray-600' : 'bg-green-50 text-green-700'}`}>{order.status || 'placed'}</span>
                                        {order.status === 'placed' && (
                                            <button
                                                type="button"
                                                onClick={function() { dispatch(clearCancelError()); setOrderToCancel(order) }}
                                                disabled={cancellingOrderId !== null}
                                                className="rounded-full border border-red-200 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                                            >
                                                {cancellingOrderId === order.id ? 'Cancelling…' : 'Cancel Order'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {(order.items || []).map(function(item, index) {
                                        return <p key={`${item.productId}-${index}`} className="py-3 text-sm text-gray-700">{item.name} <span className="text-gray-500">× {item.quantity}</span></p>
                                    })}
                                </div>
                                <p className="border-t border-gray-100 pt-4 text-right font-semibold text-gray-900">Total: ₹{Number(order.total || 0).toLocaleString('en-IN')}</p>
                            </article>
                        )
                    })}
                </div>
            )}
            {orderToCancel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5" role="presentation">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cancel-order-title"
                        className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
                    >
                        <h2 id="cancel-order-title" className="text-xl font-semibold text-gray-900">Cancel this order?</h2>
                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            Order #{orderToCancel.id} will be cancelled and its items returned to stock.
                        </p>
                        {cancelError && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{cancelError}</p>}
                        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={function() { setOrderToCancel(null); dispatch(clearCancelError()) }}
                                disabled={cancellingOrderId !== null}
                                className="rounded-full border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Keep Order
                            </button>
                            <button
                                type="button"
                                onClick={function() { handleCancelOrder(orderToCancel) }}
                                disabled={cancellingOrderId !== null}
                                className="rounded-full bg-red-600 px-5 py-3 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {cancellingOrderId === orderToCancel.id ? 'Cancelling…' : 'Cancel Order'}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </main>
    )
}

export default MyOrders
