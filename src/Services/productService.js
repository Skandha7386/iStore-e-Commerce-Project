import axios from 'axios'

const PRODUCTS_API_URL = 'http://localhost:3000/products'

export async function updateProductStock(productId, stock) {
    const response = await axios.patch(`${PRODUCTS_API_URL}/${productId}`, { stock })
    return response.data
}
