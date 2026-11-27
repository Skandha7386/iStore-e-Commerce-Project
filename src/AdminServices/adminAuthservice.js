import axios from 'axios'

const API_URL="http://localhost:3000/admins"

export async function loginAdmin(username, password) {
    const response = await axios.get(API_URL)

    const admin = response.data.find(function(item) {
        return item.username === username && item.password === password
    })

    return admin
}
