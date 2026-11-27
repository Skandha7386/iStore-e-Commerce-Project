import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getAdminProducts,
    addAdminProduct,
    deleteAdminProduct,
    updateAdminProduct
} from '../AdminServices/adminProductService'
import { useState,useEffect } from 'react'
import { ArrowUpDown, ChevronDown, ListFilter, Search } from 'lucide-react'

function Products() {


    // Form states
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState('')
    const [stock, setStock] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const [device, setDevice] = useState('')
    const [accessoryType, setAccessoryType] = useState('')

    // Show or hide form
    const [showForm, setShowForm] = useState(false)

    // Edit id
    const [editId, setEditID] = useState(null)

    // Search and filter states
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedStock, setSelectedStock] = useState('')


    const [sortBy,setSortBy]=useState('')

    
    const [currentPage,setCurrentPage]=useState(1)
    const [productPerPage]=useState(5)






 
    const queryClient = useQueryClient()

    // Add product mutation
    const addProductionMutation = useMutation({
        mutationFn: addAdminProduct,

        onSuccess: function () {
            queryClient.invalidateQueries({
                queryKey: ['adminProduct_fetch']
            })
            resetForm()
        },

        onError: function (error) {
            console.log("Error Add the Product", error)
        }
    })

    // Delete product mutation
    const deleteMutation = useMutation({
        mutationFn: deleteAdminProduct,

        onSuccess: function () {
            queryClient.invalidateQueries({
                queryKey: ['adminProduct_fetch']
            })
        },

        onError: function (error) {
            console.log("Error delete Product:", error)
        }
    })

    // Update product mutation
    const updateMutation = useMutation({
        mutationFn: updateAdminProduct,

        onSuccess: function () {
            queryClient.invalidateQueries({
                queryKey: ['adminProduct_fetch']
            })
            resetForm()
        }
    })

            useEffect(function(){
        setCurrentPage(1)
    },[search,selectedCategory,selectedStock,sortBy])


    // Fetch products
    const { data=[], isLoading, isError } = useQuery({
        queryKey: ['adminProduct_fetch'],
        queryFn: getAdminProducts
    })

 



// Search products
const filteredProducts = data.filter(function(product) {

    const productName = product.name
        ? product.name.toLowerCase()
        : ''

    const productCategory = product.category
        ? product.category.toLowerCase()
        : ''

    const searchText = search.toLowerCase()


    const matchSearch=productName.includes(searchText)||
                      productCategory.includes(searchText)


    const matchCategory=selectedCategory === ""||
                        product.category === selectedCategory


    
    
const matchStock=
                  selectedStock ===""||
                 ( selectedStock === "inStock" &&( product.stock>10))||
                  (selectedStock === "lowStock" && product.stock>0  && (product.stock<=10) )||
                 ( selectedStock === "outofStock" &&( product.stock === 0))
    return (
        matchCategory && matchSearch && matchStock
    )
})


const categories=[...new Set(
    data.map(function(product){
        return product.category
    })
)]


const sortedProducts = [...filteredProducts].sort(function(a, b) {

    if (sortBy === 'A-Z') {
        return a.name.localeCompare(b.name)
    }

    if (sortBy === 'Z-A') {
        return b.name.localeCompare(a.name)
    }

    if (sortBy === 'LowtoHigh') {
        return a.price - b.price
    }

    if (sortBy === 'HightoLow') {
        return b.price - a.price
    }

    return 0
})



 const startIndex=((currentPage - 1) * productPerPage)
 const endIndex= startIndex + productPerPage

 const currentProducts= sortedProducts.slice(startIndex,endIndex)

 const totalPage=Math.ceil(sortedProducts.length/productPerPage)

 
      useEffect(function(){
        if(totalPage >0 && currentPage > totalPage){
         setCurrentPage(totalPage)    
        }
   },[currentPage,totalPage])

      if (isLoading) {
        return <h2>Loading Products...</h2>
    }

    if (isError) {
        return <h2>Something went Wrong</h2>
    }

  



    // Submit form
    function handleSubmit(event) {
        event.preventDefault()

        const newProduct = {
            name: name,
            category: category,
            device: device,
            accessoryType: accessoryType,
            price: Number(price),
            stock: Number(stock),
            description: description,
            image: image
        }

        if (editId !== null) {
            updateMutation.mutate({
                id: editId,
                updatedProduct: newProduct
            })
        }
        else {
            addProductionMutation.mutate(newProduct)
        }
    }

    // Edit product
    function handleEdit(product) {
        setEditID(product.id)

        setName(product.name)
        setCategory(product.category)
        setPrice(product.price)
        setStock(product.stock)
        setDevice(product.device)
        setAccessoryType(product.accessoryType)
        setDescription(product.description)
        setImage(product.image)

        setShowForm(true)
    }

    // Reset form
    function resetForm() {
        setShowForm(false)
        setEditID(null)

        setName('')
        setCategory('')
        setPrice('')
        setStock('')
        setDescription('')
        setImage('')
        setDevice('')
        setAccessoryType('')
       
    }

    return (
        <div>

            {/* Heading */}
            <div className="flex items-center justify-between mb-6">

                <h1 className="text-2xl font-bold text-gray-800">
                    Manage Products
                </h1>

                <button
                    type="button"
                    onClick={function () {
                        resetForm()
                        setShowForm(true)
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium"
                >
                    + Add New Product
                </button>

            </div>

            {/* Search and Filters */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
                <div className="min-w-0 xl:col-span-2">
                    <label htmlFor="products-search" className="mb-2 block text-sm font-medium text-gray-700">
                        Search products
                    </label>
                    <div className="relative">
                        <Search
                            size={18}
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            id="products-search"
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={function(event) {
                                setSearch(event.target.value)
                            }}
                            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="products-category-filter" className="mb-2 block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <div className="relative">
                        <ListFilter
                            size={17}
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <select
                            id="products-category-filter"
                            value={selectedCategory}
                            onChange={function(event) {
                                setSelectedCategory(event.target.value)
                            }}
                            className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-10 text-sm font-medium text-gray-700 shadow-sm outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        >
                            <option value="">All Category</option>
                            {categories.map(function(category) {
                                return (
                                    <option key={category}>{category}</option>
                                )
                            })}
                        </select>
                        <ChevronDown
                            size={17}
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="products-stock-filter" className="mb-2 block text-sm font-medium text-gray-700">
                        Stock
                    </label>
                    <div className="relative">
                        <ListFilter
                            size={17}
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <select
                            id="products-stock-filter"
                            value={selectedStock}
                            onChange={function(event) {
                                setSelectedStock(event.target.value)
                            }}
                            className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-10 text-sm font-medium text-gray-700 shadow-sm outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        >
                            <option value="">All Stock</option>
                            <option value="inStock">In Stock</option>
                            <option value="lowStock">Low Stock</option>
                            <option value="outofStock">Out of Stock</option>
                        </select>
                        <ChevronDown
                            size={17}
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="products-sort-filter" className="mb-2 block text-sm font-medium text-gray-700">
                        Sort by
                    </label>
                    <div className="relative">
                        <ArrowUpDown
                            size={17}
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <select
                            id="products-sort-filter"
                            value={sortBy}
                            onChange={function(event) {
                                setSortBy(event.target.value)
                            }}
                            className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-10 text-sm font-medium text-gray-700 shadow-sm outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        >
                            <option value="">Default</option>
                            <option value="A-Z">Product Name: A-Z</option>
                            <option value="Z-A">Product Name: Z-A</option>
                            <option value="LowtoHigh">Price:Low to High</option>
                            <option value="HightoLow">Price:High to Low</option>
                        </select>
                        <ChevronDown
                            size={17}
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    </div>
                </div>

                {/* Clear Filter */}
                <button
                    type="button"
                    className="self-end rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-100 xl:w-full"
                    onClick={function () {
                        setSearch('')
                        setSelectedCategory('')
                        setSelectedStock('')
                        setSortBy('')
                    }}
                >
                    Clear Filter
                </button>

            </div>

            {/* Add Product Form */}
            {showForm &&
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-xl shadow-md my-6"
                >

                    <h2 className="text-xl font-bold mb-5">
                        {editId !== null ? "Edit Product" : "Add Product"}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <input
                            type="text"
                            placeholder="Product Name"
                            value={name}
                            onChange={function (event) {
                                setName(event.target.value)
                            }}
                            className="border p-3 rounded-lg"
                        />

                        <input
                            type="text"
                            placeholder="Category"
                            value={category}
                            onChange={function (event) {
                                setCategory(event.target.value)
                            }}
                            className="border p-3 rounded-lg"
                        />

                        <input
                            type="text"
                            placeholder="Device"
                            value={device}
                            onChange={function (event) {
                                setDevice(event.target.value)
                            }}
                            className="border p-3 rounded-lg"
                        />

                        <input
                            type="text"
                            placeholder="Accessory Type"
                            value={accessoryType}
                            onChange={function (event) {
                                setAccessoryType(event.target.value)
                            }}
                            className="border p-3 rounded-lg"
                        />

                        <input
                            type="number"
                            placeholder="Price"
                            value={price}
                            onChange={function (event) {
                                setPrice(event.target.value)
                            }}
                            className="border p-3 rounded-lg"
                        />

                        <input
                            type="number"
                            placeholder="Stock"
                            value={stock}
                            onChange={function (event) {
                                setStock(event.target.value)
                            }}
                            className="border p-3 rounded-lg"
                        />

                        <input
                            type="text"
                            placeholder="Image Path (e.g. iphone16.jpg)"
                            value={image}
                            onChange={function (event) {
                                setImage(event.target.value)
                            }}
                            className="border p-3 rounded-lg md:col-span-2"
                        />

                        <textarea
                            placeholder="Product Description"
                            value={description}
                            onChange={function (event) {
                                setDescription(event.target.value)
                            }}
                            className="border p-3 rounded-lg md:col-span-2"
                            rows="4"
                        />

                    </div>

                    <div className="flex gap-3 mt-5">

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                        >
                            {editId !== null ? 'Update Product' : 'Submit Product'}
                        </button>

                        <button
                            type="button"
                            onClick={function () {
                                resetForm()
                            }}
                            className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-lg"
                        >
                            Cancel
                        </button>

                    </div>

                </form>
            }

            {/* Existing Products Table */}
            <table className="w-full border-collapse bg-white">

                <thead>
                    <tr>
                        <th>Product Image</th>
                        <th>Category</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {currentProducts.map(function (product) {
                        return (
                            <tr key={product.id}>

                                <td>
                                    <img
                                        src={
                                            product.image
                                                ? (
                                                    product.image.startsWith('/Images')
                                                        ? product.image
                                                        : `/Images/${product.image}`
                                                )
                                                : 'https://placehold.co/100x100?text=No+Image'
                                        }
                                        alt={product.name}
                                        className="w-16 h-16 object-contain"
                                    />
                                </td>

                                <td>{product.category}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.stock}</td>

                                <td className="px-4 py-3 text-center align-middle">
                                    <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                                        <button
                                            className="inline-flex h-9 min-w-20 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                                            onClick={function () {
                                                handleEdit(product)
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={function () {
                                                deleteMutation.mutate(product.id)
                                            }}
                                            className="inline-flex h-9 min-w-20 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        )
                    })}


                </tbody>

            </table>
           <div className="flex justify-center items-center gap-4 mt-6">

    <button
        onClick={function() {
            if(currentPage > 1){
                  setCurrentPage(currentPage - 1)
            }
            
        }}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded-lg disabled:opacity-50"
    >
        Previous
    </button>

    <span>
        Page {currentPage} of {totalPage}
    </span>

    <button
        onClick={function() {
            setCurrentPage(currentPage + 1)
        }}
        disabled={currentPage === totalPage}
        className="px-4 py-2 border rounded-lg disabled:opacity-50"
    >
        Next
    </button>

</div>
        </div>
    )
}

export default Products
