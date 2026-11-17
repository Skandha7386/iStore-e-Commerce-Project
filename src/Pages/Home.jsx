
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { fetchProducts } from '../Redux/productSlice'

import Banner from '../assets/banner.png'

function Home() {

    const dispatch = useDispatch()

    const { products, isLoading, error } = useSelector(
        function(state) {
            return state.products
        }
    )



    useEffect(function() {
        dispatch(fetchProducts())
    }, [dispatch])


    // Get all unique categories

    const categories = [...new Set(products.map(function(item) {
        return item.category
    }))]


    // Get first product from each category for its image

    const categoryItems = categories.map(function(category) {

        const categoryProduct = products.find(function(item) {
            return item.category === category
        })

        return {
            name: category,
            image: categoryProduct ? categoryProduct.image : ""
        }

    })


    // Featured Products

    const featuredProducts = products.slice(0, 4)

    // Keep the home page focused on featured items; navbar searches belong to the store.
    const search = ""
    const displayProducts = featuredProducts


    // Handle image paths

    function getImagePath(image) {

        if (!image) {
            return "https://placehold.co/400x400?text=Product"
        }

        if (image.startsWith('http') || image.startsWith('/')) {
            return image
        }

        return `/Images/${image}`
    }


    return (

        <div className="bg-white min-h-screen">


            {/* Hero Section */}

            <section className="px-5 md:px-10 pt-8">

                <div className="relative overflow-hidden rounded-3xl">

                    <img
                        src={Banner}
                        alt="iStore Accessories"
                        className="w-full h-[350px] md:h-[500px] object-cover"
                    />

                </div>

            </section>



            {/* Introduction */}

            <section className="text-center py-20 px-5">

                <p className="text-sm font-medium text-gray-500 mb-4">
                    Welcome to iStore
                </p>

                <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-gray-900">
                    Accessories. Made better.
                </h1>

                <p className="text-gray-500 text-base md:text-xl mt-5 max-w-2xl mx-auto">
                    Discover accessories designed to complement your everyday technology.
                </p>

                <Link
                    to="/products"
                    className="inline-block mt-7 bg-[#0071e3] text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-[#0077ed] transition"
                >
                    Shop Now
                </Link>

            </section>



            {/* Categories */}

            <section className="bg-[#f5f5f7] py-16">

                <div className="max-w-7xl mx-auto px-5 md:px-10">

                    <div className="mb-10">

                        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                            Shop by category.
                        </h2>

                        <p className="text-gray-500 mt-3">
                            Find exactly what you're looking for.
                        </p>

                    </div>


                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">

                        {categoryItems.map(function(item) {

                            return (

                                <Link
                                    key={item.name}
                                    to={`/products?category=${encodeURIComponent(item.name)}`}
                                    className="bg-white rounded-3xl p-5 text-center hover:shadow-lg transition duration-300 group"
                                >

                                    <div className="h-36 md:h-44 flex items-center justify-center">

                                        <img
                                            src={getImagePath(item.image)}
                                            alt={item.name}
                                            onError={function(event) {
                                                event.target.onerror = null
                                                event.target.src = "https://placehold.co/400x400?text=Product"
                                            }}
                                            className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition duration-300"
                                        />

                                    </div>

                                    <h3 className="text-base md:text-lg font-semibold mt-4">
                                        {item.name}
                                    </h3>

                                    <p className="text-[#0071e3] text-sm mt-2">
                                        Explore
                                    </p>

                                </Link>

                            )

                        })}

                    </div>

                </div>

            </section>



            {/* Products / Search Results */}

            <section className="max-w-7xl mx-auto px-5 md:px-10 py-20">

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">

                    <div>

                        <p className="text-sm text-gray-500 mb-3">Handpicked for you</p>
                        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Featured products.</h2>

                    </div>


                    {search ? (

                        <button
                            onClick={clearSearch}
                            className="text-[#0071e3] hover:underline text-sm font-medium"
                        >
                            Clear Search ✕
                        </button>

                    ) : (

                        <Link
                            to="/products"
                            className="text-[#0071e3] hover:underline text-sm font-medium"
                        >
                            View all products →
                        </Link>

                    )}

                </div>


                {isLoading && (

                    <p className="text-center text-gray-500 py-10">
                        Loading products...
                    </p>

                )}


                {error && (

                    <p className="text-center text-red-500 py-10">
                        {error}
                    </p>

                )}


                {!isLoading && !error && displayProducts.length === 0 && (

                    <p className="text-center text-gray-500 py-10">
                        {search
                            ? `No products found for "${search}".`
                            : "No products available."
                        }
                    </p>

                )}


                {!isLoading && !error && displayProducts.length > 0 && (

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {displayProducts.map(function(item) {

                            return (

                                <div
                                    key={item.id}
                                    className="bg-[#f5f5f7] rounded-3xl p-5 hover:shadow-lg transition duration-300"
                                >

                                    <Link to={`/products/${item.id}`}>

                                        <div className="h-56 flex items-center justify-center">

                                            <img
                                                src={getImagePath(item.image)}
                                                alt={item.name}
                                                onError={function(event) {
                                                    event.target.onerror = null
                                                    event.target.src = "https://placehold.co/400x400?text=Product"
                                                }}
                                                className="max-h-full max-w-full object-contain mix-blend-multiply hover:scale-105 transition duration-300"
                                            />

                                        </div>

                                    </Link>


                                    <div className="mt-5">

                                        <p className="text-xs text-gray-500 mb-2">
                                            {item.category}
                                        </p>

                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {item.name}
                                        </h3>

                                        <p className="text-gray-900 font-medium mt-3">
                                            ₹{item.price.toLocaleString('en-IN')}
                                        </p>

                                        <Link
                                            to={`/products/${item.id}`}
                                            className="block text-center bg-[#0071e3] text-white py-3 rounded-full mt-5 text-sm hover:bg-[#0077ed] transition"
                                        >
                                            View Details
                                        </Link>

                                    </div>

                                </div>

                            )

                        })}

                    </div>

                )}

            </section>



            {/* Bottom Promotional Section */}

            {!search && (

                <section className="bg-[#f5f5f7] py-20 px-5 text-center">

                    <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
                        Make your setup yours.
                    </h2>

                    <p className="text-gray-500 mt-4 text-base md:text-lg">
                        Explore accessories that fit your everyday life.
                    </p>

                    <Link
                        to="/products"
                        className="inline-block mt-7 bg-[#0071e3] text-white px-7 py-3 rounded-full text-sm hover:bg-[#0077ed] transition"
                    >
                        Explore Store
                    </Link>

                </section>

            )}


        </div>

    )

}

export default Home
