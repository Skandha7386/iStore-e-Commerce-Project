
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// User Pages
import Home from './Pages/Home'
import Products from './Pages/Product'
import ProductDetails from './Pages/ProductDetails'
import Cart from './Pages/Cart'
import Wishlist from './Pages/WishList'
import Profile from './Pages/Profile'
import MyOrders from './Pages/myOrders'
import Register from './Pages/Register'
import Login from './Pages/Login'
import Checkout from './Pages/Checkout'

// User Components
import UserLayout from './Component/UserLayout'
import ProtectedRoute from './Component/ProtectedRoute'

// Admin Pages
import AdminLogin from './AdminPages/AdminLogin'
import AdminDashboard from './AdminPages/AdminDashboard'
import AdminOrders from './AdminPages/AdminOrders'
import AdminProduct from './AdminPages/AdminProducts'
import AdminUsers from './AdminPages/AdminUsers'
import UserDetails from './AdminPages/UserDetails'
import OrderDetails from './AdminPages/OrderDetails'

// Admin Components
import ProtectRouter from './Admin/Components/ProtectRouter'
import AdminLayout from './Admin/Components/AdminLayout'

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* User Layout */}

                <Route element={<UserLayout />}>

                    <Route path="/" element={<Home />} />

                    <Route path="/products" element={<Products />} />

                    <Route path="/accessories" element={<Products />} />

                    <Route path="/products/:id" element={<ProductDetails />} />

                    <Route
                        path="/cart"
                        element={<ProtectedRoute><Cart /></ProtectedRoute>}
                    />

                    <Route
                        path="/checkout"
                        element={<ProtectedRoute><Checkout /></ProtectedRoute>}
                    />

                    <Route
                        path="/wishlist"
                        element={<ProtectedRoute><Wishlist /></ProtectedRoute>}
                    />

                    <Route path="/login" element={<Login />} />

                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/profile"
                        element={<ProtectedRoute><Profile /></ProtectedRoute>}
                    />

                    <Route
                        path="/my-orders"
                        element={<ProtectedRoute><MyOrders /></ProtectedRoute>}
                    />

                </Route>


                {/* Admin Login */}

                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />

                <Route
                    path="/login/admin"
                    element={<Navigate to="/admin/login" replace />}
                />


                {/* Admin Protected Routes */}

                <Route element={<ProtectRouter />}>

                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />

                        <Route
                            path="dashboard"
                            element={<AdminDashboard />}
                        />

                        <Route
                            path="products"
                            element={<AdminProduct />}
                        />

                        <Route
                            path="orders"
                            element={<AdminOrders />}
                        />

                        <Route
                            path="users"
                            element={<AdminUsers />}
                        />

                        <Route
                           path="users/:id"
                           element={<UserDetails />} 
                        />
                        <Route path="orders/:id" 
                        element={<OrderDetails />} />

                    </Route>

                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>

        </BrowserRouter>
    )
}

export default App
