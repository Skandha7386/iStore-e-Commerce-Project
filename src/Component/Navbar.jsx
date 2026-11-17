
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { mergeSavedCartItems } from '../Redux/cartSlice'
import { mergeSavedFavorites } from '../Redux/wishListSlice'
import { getCartForUser } from '../Services/cartService'
import { getFavoritesForUser } from '../Services/favoriteService'
import {
    Search,
    Heart,
    ShoppingCart,
    User,
    X
} from 'lucide-react'

function Navbar() {

    const [searchOpen, setSearchOpen] = useState(false)
    const [search, setSearch] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(function(state) { return state.auth.user })
    const cartCount = useSelector(function(state) {
        return state.cart.items.reduce(function(total, item) {
            return total + item.quantity
        }, 0)
    })
    const favoriteCount = useSelector(function(state) {
        return state.wishlist.items.length
    })

    useEffect(function() {
        if (!user?.id) return
        let active = true

        Promise.all([
            getCartForUser(user.id),
            getFavoritesForUser(user.id)
        ]).then(function(results) {
            if (!active) return
            dispatch(mergeSavedCartItems(results[0]))
            dispatch(mergeSavedFavorites(results[1]))
        }).catch(function(error) {
            console.error('Could not load saved cart and favorites.', error)
        })

        return function() { active = false }
    }, [dispatch, user?.id])

    

    function openSearch() {
        setSearchOpen(true)
        setSearch("")
    }

    function closeSearch() {
        setSearchOpen(false)
        setSearch("")
    }

    // Navigate to Products page with search text
    function handleSearch(event) {
        event.preventDefault()
        const query = search.trim()
        if (!query) return

        navigate(`/products?search=${encodeURIComponent(query)}`)
        closeSearch()
    }

    return (
        <>

            <nav className="w-full bg-white border-b border-gray-200 relative z-40">

                <div className="w-full px-4 h-16 grid grid-cols-3 items-center">

                    {/* Logo */}
                    <div className="flex justify-start">
                        <Link to="/" className="text-2xl font-bold text-black">
                            iStore
                        </Link>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-8 text-sm font-medium text-gray-600">

                        <Link to="/" className="hover:text-black">
                            Home
                        </Link>

                        <Link to="/products" className="hover:text-black">
                            Store
                        </Link>

                        <Link to="/accessories" className="hover:text-black">
                            Accessories
                        </Link>

                    </div>

                    {/* Icons */}
                    <div className="flex items-center justify-end gap-6 text-gray-700">

                        <button onClick={openSearch} className="hover:text-black">
                            <Search size={20} />
                        </button>

                        <Link to="/wishlist" className="relative" aria-label={`Favorites, ${favoriteCount} items`}>
                            <Heart size={20} />
                            {favoriteCount > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-rose-600 px-1.5 text-[10px] leading-4 text-white">{favoriteCount}</span>}
                        </Link>

                        <Link to="/cart" className="relative" aria-label={`Cart, ${cartCount} items`}>
                            <ShoppingCart size={20} />
                            {cartCount > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-[#0071e3] px-1.5 text-[10px] leading-4 text-white">{cartCount}</span>}
                        </Link>

                        <Link to="/profile" aria-label="Profile">
                            <User size={20} />
                        </Link>

                    </div>

                </div>

            </nav>

            {/* Glass Search Panel */}
            {searchOpen && (

                <div
                    className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
                    onClick={closeSearch}
                >

                    <div
                        className="w-full md:w-[60%] mx-auto mt-16
                                   bg-white/75 backdrop-blur-2xl
                                   border border-white/60
                                   shadow-2xl rounded-2xl px-6 py-7"
                        onClick={function(e) {
                            e.stopPropagation()
                        }}
                    >

                        {/* Search Input */}
                        <div className="flex items-center gap-4 max-w-3xl mx-auto">

                            <Search size={24} className="text-gray-500 shrink-0" />

                            <form onSubmit={handleSearch} className="flex-1">

                                <input
                                    type="text"
                                    placeholder="Search iStore"
                                    value={search}
                                    onChange={function(e) {
                                        setSearch(e.target.value)
                                    }}
                                    autoFocus
                                    className="w-full text-xl md:text-2xl outline-none bg-transparent placeholder:text-gray-500"
                                />

                            </form>

                            <button onClick={closeSearch}>
                                <X size={24} className="text-gray-500 hover:text-black" />
                            </button>

                        </div>

                        {/* Search Button */}
                        <div className="max-w-3xl mx-auto flex justify-end mt-5">

                            <button
                                onClick={handleSearch}
                                className="bg-black text-white px-6 py-2 rounded-full text-sm hover:bg-gray-800"
                            >
                                Search
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>
    )
}

export default Navbar
