import axios from "axios"

const API_URL = "http://localhost:3000/orders"

export async function getAdminOrders() {
    const response = await axios.get(API_URL)
    return response.data
}

export async function getAdminOrderById(id) {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
}

export async function updateAdminOrderStatus(id, status, statusHistory) {
    const response = await axios.patch(`${API_URL}/${id}`, {
        status: status,
        statusHistory: statusHistory
    })
    return response.data
}
