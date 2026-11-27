import { useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Navbar from './Navbar'
import Footer from './Footer'
import { clearSession } from '../Redux/authSlice'
import { clearCart } from '../Redux/cartSlice'
import { clearFavorites } from '../Redux/wishListSlice'

function UserLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const user = useSelector(function(state) {
        return state.auth.user
    })

    useEffect(function() {
        if (!user?.id) return

        let isMounted = true

        async function verifyUserStatus() {
            try {
                const response = await axios.get(`http://localhost:3000/users/${user.id}`)
                const currentUser = response.data

                if (currentUser && currentUser.status === 'Blocked') {
                    if (!isMounted) return

                    localStorage.removeItem('loggedInUser')
                    dispatch(clearSession())
                    dispatch(clearCart())
                    dispatch(clearFavorites())

                    navigate('/login', {
                        replace: true,
                        state: { blockedMessage: 'Your account has been blocked. Please contact the administrator.' }
                    })
                }
            } catch (error) {
                if (error.response?.status === 404 && isMounted) {
                    localStorage.removeItem('loggedInUser')
                    dispatch(clearSession())
                    dispatch(clearCart())
                    dispatch(clearFavorites())
                    navigate('/login', { replace: true })
                }
            }
        }

        // Verify status on route change
        verifyUserStatus()

        // Verify status when returning to the tab
        window.addEventListener('focus', verifyUserStatus)

        // Periodic check every 5 seconds for instant logout if blocked
        const interval = setInterval(verifyUserStatus, 5000)

        return function() {
            isMounted = false
            window.removeEventListener('focus', verifyUserStatus)
            clearInterval(interval)
        }
    }, [location.pathname, user?.id, dispatch, navigate])

    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}

export default UserLayout