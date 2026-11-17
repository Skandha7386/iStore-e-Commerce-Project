import axios from 'axios'

const ORDERS_API_URL = 'http://localhost:3000/orders'
const PRODUCTS_API_URL = 'http://localhost:3000/products'

export async function createOrder(orderData) {
    const response = await axios.post(ORDERS_API_URL, orderData)
    return response.data
}

export async function getOrdersForUser(userId) {
    const response = await axios.get(ORDERS_API_URL, { params: { userId } })
    return response.data
}

export async function cancelOrderAndRestock(orderId) {
    const orderResponse = await axios.get(`${ORDERS_API_URL}/${orderId}`)
    const order = orderResponse.data

    if (order.status !== 'placed') {
        throw new Error('Only placed orders can be cancelled.')
    }

    await axios.patch(`${ORDERS_API_URL}/${orderId}`, { status: 'cancelling' })
    const stockChanges = []

    try {
        for (const item of order.items || []) {
            const productResponse = await axios.get(`${PRODUCTS_API_URL}/${item.productId}`)
            const previousStock = Number(productResponse.data.stock) || 0
            const updatedStock = previousStock + (Number(item.quantity) || 0)

            await axios.patch(`${PRODUCTS_API_URL}/${item.productId}`, { stock: updatedStock })
            stockChanges.push({ productId: item.productId, stock: previousStock })
        }

        const cancelledResponse = await axios.patch(`${ORDERS_API_URL}/${orderId}`, {
            status: 'cancelled',
            cancelledAt: new Date().toISOString()
        })
        return cancelledResponse.data
    } catch (error) {
        await Promise.all(stockChanges.map(function(change) {
            return axios.patch(`${PRODUCTS_API_URL}/${change.productId}`, { stock: change.stock }).catch(function() {})
        }))
        await axios.patch(`${ORDERS_API_URL}/${orderId}`, { status: 'placed' }).catch(function() {})
        throw error
    }
}
