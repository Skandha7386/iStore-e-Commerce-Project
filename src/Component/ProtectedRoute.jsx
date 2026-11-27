import { Navigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { clearSession } from '../Redux/authSlice'
import { clearCart } from '../Redux/cartSlice'
import { clearFavorites } from '../Redux/wishListSlice'

function ProtectedRoute({ children }) {
    const dispatch = useDispatch()
    const location = useLocation()
    const loggedInUser = localStorage.getItem('loggedInUser')
    const user = loggedInUser ? JSON.parse(loggedInUser) : null

    const [isChecking, setIsChecking] = useState(Boolean(user))
    const [isBlocked, setIsBlocked] = useState(false)

    useEffect(function () {
        if (!user?.id) {
            setIsChecking(false)
            return
        }

        let isMounted = true

        async function checkUserStatus() {
            try {
                const response = await axios.get(
                    `http://localhost:3000/users/${user.id}`
                )

                if (response.data.status === 'Blocked') {
                    if (!isMounted) return
                    localStorage.removeItem('loggedInUser')
                    dispatch(clearSession())
                    dispatch(clearCart())
                    dispatch(clearFavorites())
                    setIsBlocked(true)
                }

            } catch (error) {
                if (error.response?.status === 404 && isMounted) {
                    localStorage.removeItem('loggedInUser')
                    dispatch(clearSession())
                    dispatch(clearCart())
                    dispatch(clearFavorites())
                    setIsBlocked(true)
                }
            } finally {
                if (isMounted) {
                    setIsChecking(false)
                }
            }
        }

        checkUserStatus()

        return function () {
            isMounted = false
        }

    }, [user?.id, dispatch])

    if (isChecking) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <p className="text-gray-500">Checking account status...</p>
            </div>
        )
    }

    if (!user || isBlocked) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                    blockedMessage: isBlocked ? 'Your account has been blocked. Please contact the administrator.' : undefined
                }}
            />
        )
    }

    return children
}

export default ProtectedRoute
