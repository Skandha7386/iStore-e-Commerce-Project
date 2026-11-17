import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { registerUser as createUser } from '../Services/userService'

const USERS_API_URL = 'http://localhost:3000/users'

function getErrorMessage(error, fallback) {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message
        return typeof message === 'string' ? message : fallback
    }

    return error instanceof Error ? error.message : fallback
}

function readSavedUser() {
    if (typeof localStorage === 'undefined') {
        return null
    }

    const savedUser = localStorage.getItem('loggedInUser')
    if (!savedUser) {
        return null
    }

    try {
        return JSON.parse(savedUser)
    } catch (error) {
        console.error('Could not read the saved user session.', error)
        return null
    }
}

export const loginUser = createAsyncThunk(
    'auth/login',
    async function(credentials, { rejectWithValue }) {
        const username = credentials.username.trim()

        if (!username || !credentials.password) {
            return rejectWithValue('Enter your username and password.')
        }

        try {
            const response = await axios.get(USERS_API_URL)
            const users = Array.isArray(response.data) ? response.data : []
            const loggedInUser = users.find(function(user) {
                return (
                    typeof user.username === 'string' &&
                    user.username.trim().toLowerCase() === username.toLowerCase() &&
                    user.password === credentials.password
                )
            })

            if (!loggedInUser) {
                return rejectWithValue('Invalid username or password.')
            }

            const sessionUser = {
                id: loggedInUser.id,
                name: loggedInUser.name,
                email: loggedInUser.email,
                username: loggedInUser.username
            }

            localStorage.setItem('loggedInUser', JSON.stringify(sessionUser))
            return sessionUser
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(error, 'Unable to connect to the server. Please try again.')
            )
        }
    }
)

export const registerAccount = createAsyncThunk(
    'auth/register',
    async function(userData, { rejectWithValue }) {
        const name = userData.name.trim()
        const email = userData.email.trim()
        const username = userData.username.trim()

        if (!name || !email || !username || !userData.password.trim()) {
            return rejectWithValue('Please complete all required fields.')
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return rejectWithValue('Enter a valid email address.')
        }

        const emailDomain = email.split('@')[1].toLowerCase()
        if (emailDomain === 'gamil.com') {
            return rejectWithValue('Did you mean gmail.com? Please check the spelling of your email.')
        }

        if (userData.password.length < 6) {
            return rejectWithValue('Password must contain at least 6 characters.')
        }

        if (userData.password !== userData.confirmPassword) {
            return rejectWithValue('Passwords do not match.')
        }

        try {
            const response = await axios.get(USERS_API_URL)
            const users = Array.isArray(response.data) ? response.data : []
            const normalizedUsername = username.toLowerCase()
            const normalizedEmail = email.toLowerCase()

            if (users.some(function(user) {
                return typeof user.username === 'string' &&
                    user.username.trim().toLowerCase() === normalizedUsername
            })) {
                return rejectWithValue('That username is already in use.')
            }

            if (users.some(function(user) {
                return typeof user.email === 'string' &&
                    user.email.trim().toLowerCase() === normalizedEmail
            })) {
                return rejectWithValue('That email is already in use.')
            }

            const newUser = await createUser({
                name,
                email,
                username,
                password: userData.password
            })

            return newUser
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(error, 'Registration failed. Please try again.')
            )
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: readSavedUser(),
        isLoading: false,
        error: null
    },
    reducers: {
        clearSession: function(state) {
            state.user = null
            state.error = null
        }
    },
    extraReducers: function(builder) {
        builder
            .addCase(loginUser.pending, function(state) {
                state.isLoading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, function(state, action) {
                state.isLoading = false
                state.user = action.payload
            })
            .addCase(loginUser.rejected, function(state, action) {
                state.isLoading = false
                state.error = action.payload || 'Unable to sign in. Please try again.'
            })
            .addCase(registerAccount.pending, function(state) {
                state.isLoading = true
                state.error = null
            })
            .addCase(registerAccount.fulfilled, function(state) {
                state.isLoading = false
            })
            .addCase(registerAccount.rejected, function(state, action) {
                state.isLoading = false
                state.error = action.payload || 'Registration failed. Please try again.'
            })
    }
})

export const { clearSession } = authSlice.actions
export default authSlice.reducer
