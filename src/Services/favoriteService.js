import axios from 'axios'

const FAVORITES_API_URL = 'http://localhost:3000/favorites'

export async function saveFavoritesForUser(userId, items) {
    const response = await axios.get(FAVORITES_API_URL, { params: { userId } })
    const favoriteData = { userId, items }
    const savedFavorites = response.data[0]

    if (savedFavorites) {
        const updated = await axios.patch(`${FAVORITES_API_URL}/${savedFavorites.id}`, favoriteData)
        return updated.data
    }

    const created = await axios.post(FAVORITES_API_URL, favoriteData)
    return created.data
}

export async function getFavoritesForUser(userId) {
    const response = await axios.get(FAVORITES_API_URL, { params: { userId } })
    return response.data[0]?.items || []
}
