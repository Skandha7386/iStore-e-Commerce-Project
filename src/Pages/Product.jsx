
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useSearchParams, Link } from 'react-router-dom'
import { fetchProducts } from '../Redux/productSlice'
import { Heart } from 'lucide-react'
import { toggleFavorite } from '../Redux/wishListSlice'
import iPhone from '../assets/iPhone.png'
import iPad from '../assets/iPad.png'
import Mac from '../assets/mac.png'
import AppleWatch from '../assets/apple-watch.png'
import AirPods from '../assets/airpods.png'
import AirTag from '../assets/airtag.png'
import Beats from '../assets/beats.png'

const devices = [
    { name: 'iPhone', image: iPhone },
    { name: 'iPad', image: iPad },
    { name: 'Mac', image: Mac },
    { name: 'Apple Watch', image: AppleWatch },
    { name: 'AirPods', image: AirPods },
    { name: 'AirTag', image: AirTag },
    { name: 'Beats', image: Beats }
]

const accessoryCategories = {
    iPhone: ['Cases & Protection', 'Chargers & Adapters', 'MagSafe'],
    iPad: ['Keyboards', 'Cases & Protection', 'Chargers & Adapters'],
    Mac: ['Chargers & Adapters', 'Mice & Keyboards'],
    'Apple Watch': ['Bands'],
    AirPods: ['AirPods', 'Chargers & Adapters'],
    AirTag: ['Key Rings'],
    Beats: ['Speakers', 'Cables', 'Headphones']
}

function isProductForDevice(item, device) {
    return item.device === device || (item.compatibleDevices || []).includes(device)
}

function Products() {

    const { pathname } = useLocation()
    const isAccessoriesPage = pathname === '/accessories'
    const [searchParams, setSearchParams] = useSearchParams()
    const selectedDevice = searchParams.get('device')
    const navbarSearch = searchParams.get('search') || ""

    const [category, setCategory] = useState(
        searchParams.get('category') || "All"
    )

    useEffect(function() {
        setCategory(searchParams.get('category') || "All")
        setCurrentPage(1)
    }, [searchParams])

    const [sort, setSort] = useState("default")
    const [currentPage, setCurrentPage] = useState(1)

    const productsPerPage = 6

    const dispatch = useDispatch()

    const wishlistItems = useSelector(function(state) {
    return state.wishlist.items
})

    const { products, isLoading, error } = useSelector(
        function(state) {
            return state.products
        }
    )

    useEffect(function() {
        dispatch(fetchProducts())
    }, [dispatch])

    // Search and category filtering

    const filteredProducts = products.filter(function(item) {

        const searchableText = [
            item.name,
            item.device,
            item.category,
            item.accessoryType,
            item.description
        ].filter(Boolean).join(' ').toLowerCase()
        const searchTerms = navbarSearch.toLowerCase().split(/\s+/).filter(Boolean)
        const matchSearch = searchTerms.every(function(term) {
            return searchableText.includes(term)
        })

        const allowedCategories = accessoryCategories[selectedDevice] || []
        const matchDevice = !selectedDevice || (
            isProductForDevice(item, selectedDevice) && allowedCategories.includes(item.accessoryType)
        )
        const matchCategory = selectedDevice
            ? category === "All" || item.accessoryType === category
            : category === "All" || item.category === category

        return matchSearch && matchDevice && matchCategory
    })

    // Sorting

    const sortedProducts = [...filteredProducts]

    if (sort === "lowToHigh") {
        sortedProducts.sort(function(a, b) {
            return a.price - b.price
        })
    }

    if (sort === "highToLow") {
        sortedProducts.sort(function(a, b) {
            return b.price - a.price
        })
    }

    // Pagination

    const totalPages = Math.ceil(
        sortedProducts.length / productsPerPage
    )

    const lastIndex = currentPage * productsPerPage
    const firstIndex = lastIndex - productsPerPage

    const currentProducts = sortedProducts.slice(
        firstIndex,
        lastIndex
    )

    // Loading

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-lg">
                    Loading products...
                </p>
            </div>
        )
    }

    // Error

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">
                    {error}
                </p>
            </div>
        )
    }

    return (

        <div className="min-h-screen bg-white">

            {isAccessoriesPage && (
                <section className="max-w-7xl mx-auto px-5 md:px-8 py-12">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                        Shop accessories for
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-5">
                        {devices.map(function(device) {
                            return (
                                <Link
                                    key={device.name}
                                    to={`/accessories?device=${encodeURIComponent(device.name)}`}
                                    className="flex flex-col items-center gap-3 text-center group"
                                >
                                    <span className="h-24 w-full flex items-center justify-center">
                                        <img
                                            src={device.image}
                                            alt=""
                                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition"
                                        />
                                    </span>
                                    <span className="text-sm font-medium text-gray-800">
                                        {device.name}
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                    {selectedDevice && (
                        <div className="mt-12 border-t border-gray-200 pt-10">
                            <p className="text-sm font-medium text-gray-500 mb-2">
                                {selectedDevice} accessories
                            </p>
                            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
                                Shop {selectedDevice} accessories.
                            </h1>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(accessoryCategories[selectedDevice] || []).map(function(option) {
                                    const categoryProducts = products.filter(function(item) {
                                        return isProductForDevice(item, selectedDevice) && item.accessoryType === option
                                    })
                                    const categoryImage = categoryProducts[0]
                                        ? (categoryProducts[0].image.startsWith('/') ? categoryProducts[0].image : `/Images/${categoryProducts[0].image}`)
                                        : null
                                    return (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={function() {
                                                setCategory(option)
                                                setCurrentPage(1)
                                                setSearchParams({ device: selectedDevice, category: option })
                                            }}
                                            className={`group overflow-hidden rounded-3xl border text-left transition hover:shadow-md ${category === option ? 'border-black ring-1 ring-black' : 'border-gray-200'}`}
                                        >
                                            <span className="flex h-36 items-center justify-center bg-[#f5f5f7] p-5">
                                                {categoryImage ? (
                                                    <img src={categoryImage} alt="" className="h-full max-w-full object-contain transition group-hover:scale-105" />
                                                ) : (
                                                    <span className="text-4xl font-light text-gray-300">{option.slice(0, 1)}</span>
                                                )}
                                            </span>
                                            <span className="flex items-center justify-between gap-3 p-5">
                                                <span>
                                                    <span className="block font-semibold text-gray-900">{option}</span>
                                                    <span className="mt-1 block text-sm text-gray-500">{categoryProducts.length} {categoryProducts.length === 1 ? 'item' : 'items'}</span>
                                                </span>
                                                <span className="text-xl text-[#0071e3]" aria-hidden="true">→</span>
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </section>
            )}

            {!isAccessoriesPage && (
                <section className="bg-[#f5f5f7] py-16 text-center">
                    <p className="text-sm text-gray-500 mb-3">
                        iStore Accessories
                    </p>
                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
                        Explore our products.
                    </h1>
                    <p className="text-gray-500 mt-4 text-base md:text-lg">
                        Find the perfect accessories for your everyday life.
                    </p>
                </section>
            )}


            {/* Products Section */}

            {(!isAccessoriesPage || selectedDevice) && (
            <section id="product-list" className="max-w-7xl mx-auto px-5 md:px-8 py-12">

                {/* Filters */}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10">

                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">
                            {category !== 'All' ? category : selectedDevice ? `${selectedDevice} Accessories` : 'All Accessories'}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            {filteredProducts.length} products available
                        </p>
                    </div>


                    <div className="flex flex-col sm:flex-row gap-3">

                        {/* Category */}

                        {!selectedDevice && <select
                            value={category}
                            onChange={function(event) {
                                setCategory(event.target.value)
                                setCurrentPage(1)
                            }}
                            className="border border-gray-300 rounded-full px-5 py-3 text-sm outline-none bg-white"
                        >

                            <option value="All">All Categories</option>
                            <option value="Cases">Cases</option>
                            <option value="Chargers">Chargers</option>
                            <option value="Audio">Audio</option>
                            <option value="Screen Protectors">Screen Protectors</option>
                            <option value="Cables">Cables</option>
                            <option value="Accessories">Accessories</option>
                            <option value="AirTag">AirTag</option>
                            <option value="Wearables">Wearables</option>

                        </select>}


                        {/* Sorting */}

                        <select
                            value={sort}
                            onChange={function(event) {
                                setSort(event.target.value)
                                setCurrentPage(1)
                            }}
                            className="border border-gray-300 rounded-full px-5 py-3 text-sm outline-none bg-white"
                        >

                            <option value="default">Recommended</option>
                            <option value="lowToHigh">Price: Low to High</option>
                            <option value="highToLow">Price: High to Low</option>

                        </select>

                    </div>

                </div>


                {/* Product Cards */}

                {filteredProducts.length === 0 ? (

                    <div className="text-center py-24">

                        <h2 className="text-2xl font-semibold text-gray-800">
                            No products found
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Try another category or use the navbar search.
                        </p>

                        <button
                            onClick={function() {
                                setCategory("All")
                                setCurrentPage(1)
                                if (searchParams.has('search') || searchParams.has('category')) {
                                    setSearchParams(selectedDevice ? { device: selectedDevice } : {})
                                }
                            }}
                            className="mt-5 bg-black text-white px-6 py-3 rounded-full text-sm"
                        >
                            Clear Filters
                        </button>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {currentProducts.map(function(item) {

                            const imagePath = item.image.startsWith('/')
                                ? item.image
                                : `/Images/${item.image}`

                                const isWishlisted = wishlistItems.some(function(product) {
    return String(product.id) === String(item.id)
})

                            return (

                               <div
    key={item.id}
    className="bg-white rounded-3xl p-6 flex flex-col transition duration-300 hover:shadow-lg"
>

                                    {/* Product Image */}

                                   <div className="relative">
    <Link to={`/products/${item.id}`}>
        <div className="h-64 flex items-center justify-center">
            <img
                src={imagePath}
                alt={item.name}
                className="max-h-full object-contain"
            />
        </div>
    </Link>

    <button
        type="button"
        onClick={function(event) {
            event.stopPropagation()
            dispatch(toggleFavorite(item))
        }}
        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:scale-110 transition"
    >
        <Heart
            size={22}
            fill={isWishlisted ? 'red' : 'none'}
            color={isWishlisted ? 'red' : 'black'}
        />
    </button>
</div>


                                    {/* Product Information */}

                                    <div className="mt-5 flex-1">

                                        <p className="text-xs text-gray-500 mb-2">
                                            {item.category}
                                        </p>

                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {item.name}
                                        </h3>

                                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                            {item.description}
                                        </p>

                                        <p className="text-lg font-semibold text-gray-900 mt-4">
                                            {Number.isFinite(item.price) ? `₹${item.price.toLocaleString('en-IN')}` : 'Price not set'}
                                        </p>

                                    </div>


                                    {/* Details Button */}

                                    <Link
                                        to={`/products/${item.id}`}
                                        className="mt-5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-center rounded-full py-3 text-sm font-medium transition"
                                    >
                                        View Details
                                    </Link>

                                </div>

                            )

                        })}

                    </div>

                )}


                {/* Pagination */}

                {filteredProducts.length > 0 && (

                    <div className="flex justify-center items-center gap-6 mt-12">

                        <button
                            disabled={currentPage === 1}
                            onClick={function() {
                                setCurrentPage(currentPage - 1)
                            }}
                            className="px-5 py-2 rounded-full border border-gray-300 text-sm disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={function() {
                                setCurrentPage(currentPage + 1)
                            }}
                            className="px-5 py-2 rounded-full border border-gray-300 text-sm disabled:opacity-40"
                        >
                            Next
                        </button>

                    </div>

                )}

            </section>
            )}

        </div>

    )

}

export default Products
