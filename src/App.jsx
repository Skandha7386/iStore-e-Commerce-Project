
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './Pages/Home'
import Products from './Pages/Product'
import ProductDetails from './Pages/ProductDetails'
import Cart from './Pages/Cart'
import Wishlist from './Pages/WishList'
import Profile from './Pages/Profile'
import MyOrders from './Pages/myOrders'

import Navbar from './Component/Navbar'
import Register from './Pages/Register'
import Login from './Pages/Login'
import ProtectedRoute from './Component/ProtectedRoute'
import Checkout from './Pages/Checkout'
import Footer from './Component/Footer'

function App() {

    return (
        <BrowserRouter>
        
        <Navbar/>

        

            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/products" element={<Products />} />

                <Route path="/accessories" element={<Products />} />

                <Route path="/products/:id" element={<ProductDetails />} />

                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />

                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

                <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />

            </Routes>
            <Footer/>

        </BrowserRouter>
    )
}

export default App
