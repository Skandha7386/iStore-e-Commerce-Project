import axios from 'axios'

const CARTS_API_URL = 'http://localhost:3000/carts'

export async function saveCartForUser(userId, items) {
    const response = await axios.get(CARTS_API_URL, { params: { userId } })
    const cartData = { userId, items }
    const existingCart = response.data[0]

    if (existingCart) {
        const updatedCart = await axios.patch(`${CARTS_API_URL}/${existingCart.id}`, cartData)
        return updatedCart.data
    }

    const createdCart = await axios.post(CARTS_API_URL, cartData)
    return createdCart.data
}

export async function getCartForUser(userId) {
    const response = await axios.get(CARTS_API_URL, { params: { userId } })
    return response.data[0]?.items || []
}
