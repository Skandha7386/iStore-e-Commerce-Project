import axios from 'axios'

const USERS_API_URL = 'http://localhost:3000/users'

export async function registerUser(userData) {
    const response = await axios.post(USERS_API_URL, userData)
    return response.data
}

export async function updateUser(userId, updates) {
    const response = await axios.get(USERS_API_URL)
    const duplicate = response.data.find(function(user) {
        return String(user.id) !== String(userId) && (
            user.username.toLowerCase() === updates.username.toLowerCase() ||
            user.email.toLowerCase() === updates.email.toLowerCase()
        )
    })

    if (duplicate) {
        throw new Error('That username or email is already in use.')
    }

    const updatedResponse = await axios.patch(`${USERS_API_URL}/${userId}`, updates)
    return updatedResponse.data
}
