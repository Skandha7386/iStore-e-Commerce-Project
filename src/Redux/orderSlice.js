import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { cancelOrderAndRestock, createOrder as saveOrder, getOrdersForUser } from '../Services/orderService'

function getErrorMessage(error, fallback) {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message
        return typeof message === 'string' ? message : fallback
    }

    return error instanceof Error ? error.message : fallback
}

export const fetchOrdersForUser = createAsyncThunk(
    'orders/fetchForUser',
    async function(userId, { rejectWithValue }) {
        if (userId === null || userId === undefined || String(userId).trim() === '') {
            return rejectWithValue('Sign in to view your orders.')
        }

        try {
            return await getOrdersForUser(userId)
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Could not load your orders. Please try again.'))
        }
    }
)

export const submitOrder = createAsyncThunk(
    'orders/submit',
    async function(orderData, { rejectWithValue }) {
        if (orderData.userId === null || orderData.userId === undefined || String(orderData.userId).trim() === '') {
            return rejectWithValue('Sign in before placing an order.')
        }

        const requiredCustomerFields = ['name', 'email', 'phone', 'address']
        if (!orderData.customer || requiredCustomerFields.some(function(field) {
            return typeof orderData.customer[field] !== 'string' || !orderData.customer[field].trim()
        })) {
            return rejectWithValue('Complete all delivery details before placing your order.')
        }

        if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
            return rejectWithValue('Your cart is empty.')
        }

        if (!Number.isFinite(orderData.total) || orderData.total < 0) {
            return rejectWithValue('The order total is invalid.')
        }

        try {
            return await saveOrder(orderData)
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Could not place the order. Please try again.'))
        }
    }
)

export const cancelOrder = createAsyncThunk(
    'orders/cancel',
    async function(orderId, { rejectWithValue }) {
        if (orderId === null || orderId === undefined || String(orderId).trim() === '') {
            return rejectWithValue('The order ID is invalid.')
        }

        try {
            return await cancelOrderAndRestock(orderId)
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Could not cancel this order.'))
        }
    }
)

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        isLoading: false,
        error: null,
        isCreating: false,
        createError: null,
        cancellingOrderId: null,
        cancelError: null
    },
    reducers: {
        clearCancelError: function(state) {
            state.cancelError = null
        }
    },
    extraReducers: function(builder) {
        builder
            .addCase(fetchOrdersForUser.pending, function(state) {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchOrdersForUser.fulfilled, function(state, action) {
                state.isLoading = false
                state.orders = action.payload
            })
            .addCase(fetchOrdersForUser.rejected, function(state, action) {
                state.isLoading = false
                state.error = action.payload || 'Could not load your orders. Please try again.'
            })
            .addCase(submitOrder.pending, function(state) {
                state.isCreating = true
                state.createError = null
            })
            .addCase(submitOrder.fulfilled, function(state, action) {
                state.isCreating = false
                state.orders.unshift(action.payload)
            })
            .addCase(submitOrder.rejected, function(state, action) {
                state.isCreating = false
                state.createError = action.payload || 'Could not place the order. Please try again.'
            })
            .addCase(cancelOrder.pending, function(state, action) {
                state.cancellingOrderId = action.meta.arg
                state.cancelError = null
            })
            .addCase(cancelOrder.fulfilled, function(state, action) {
                state.cancellingOrderId = null
                state.orders = state.orders.map(function(order) {
                    return order.id === action.payload.id ? action.payload : order
                })
            })
            .addCase(cancelOrder.rejected, function(state, action) {
                state.cancellingOrderId = null
                state.cancelError = action.payload || 'Could not cancel this order.'
            })
    }
})

export const { clearCancelError } = orderSlice.actions
export default orderSlice.reducer