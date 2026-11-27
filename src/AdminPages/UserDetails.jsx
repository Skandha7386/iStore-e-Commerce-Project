import {useParams,useNavigate} from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAdminUserById } from '../AdminServices/adminUserService'
import { getAdminOrders } from '../AdminServices/adminOrderservice'
import {useState} from 'react'
function UserDetails() {


   const [currentPage,setCurrentPage]=useState(1)

   const userDetailsPerPage=5

    const { id } = useParams()

    const navigate=useNavigate()

    const {data,isLoading,isError}=useQuery({
        queryKey:['adminUser',id],
        queryFn:function(){
            return getAdminUserById(id)
        }
    })

    const {data:orders=[]}=useQuery({
        queryKey:['adminOrders'],
        queryFn:getAdminOrders
    })

      //All orders belonging to the selected user.
    const userOrders = orders.filter(function(order) {
    return order.userId === id
})
//Number of orders.
const totalOrders = userOrders.length
//Total value of those orders.
const totalSpent = userOrders.reduce(function(total, order) {
    if (order.status !== "Cancelled") {
        return total + order.total
    }

    return total
}, 0)

const phone = userOrders.length > 0
    ? userOrders[0].customer.phone
    : "Not available"

 const latestOrders=userOrders[userOrders.length-1]

 const address=latestOrders
             ?latestOrders.customer.address
             :"No Address Available"



    const startIndex = (currentPage - 1) * userDetailsPerPage
    const endIndex = startIndex + userDetailsPerPage

    const totalPage=Math.ceil(userOrders.length/userDetailsPerPage)

    const currentOrders=userOrders.slice(startIndex,endIndex)

    
   if (isLoading) {
    return <h2>Loading User Details...</h2>
}

if (isError) {
    return <h2>Something went wrong!</h2>
}

    return (
    
    <div className="p-6">

        <h1 className="text-2xl font-bold mb-6">
            User Details
        </h1>

        {/* Summary Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

    {/* Total Orders */}
    <div className="bg-white p-6 rounded-xl shadow-sm">
        <p className="text-gray-500 text-sm">Total Orders</p>
        <h2 className="text-2xl font-bold mt-2">{totalOrders}</h2>
    </div>

    {/* Total Amount Spent */}
    <div className="bg-white p-6 rounded-xl shadow-sm">
        <p className="text-gray-500 text-sm">Total Amount Spent</p>
        <h2 className="text-2xl font-bold mt-2">
            ₹{totalSpent}
        </h2>
    </div>

    {/* Account Status */}
    <div className="bg-white p-6 rounded-xl shadow-sm">
        <p className="text-gray-500 text-sm">Account Status</p>
        <h2 className="text-2xl font-bold mt-2">
            {data.status || "Active"}
        </h2>
    </div>

</div>

        <button onClick={function(){
            navigate(`/admin/users`)
        }}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg mb-4">
             ← Back to Users
            </button>

        {/* Personal Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm">

            <h2 className="text-xl font-semibold mb-4">
                Personal Information
            </h2>

            <p>Full Name: {data.name}</p>

            <p>Username: {data.username}</p>

            <p>Email: {data.email}</p>
            
            <p>Phone: {phone}</p>

            <p>Account Role: {data.role}</p>

        </div>

        {/* Address Information */}
<div className="bg-white p-6 rounded-xl shadow-sm mt-6">

    <h2 className="text-xl font-semibold mb-4">
        Address Information
    </h2>

    <p className="text-gray-700">
        {address}
    </p>

</div>



{/* Order History */}
<div className="bg-white rounded-xl shadow-sm mt-6">

    <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
            Order History
        </h2>
        <p className="text-sm text-gray-500 mt-1">
            View all orders placed by this customer
        </p>
    </div>

    <div className="overflow-x-auto">

        <table className="w-full text-left">

            <thead className="bg-gray-50">
                <tr className="text-xs text-gray-500 uppercase">
                    <th className="px-5 py-4 font-medium">Order</th>
                    <th className="px-5 py-4 font-medium">Items</th>
                    <th className="px-5 py-4 font-medium">Payment</th>
                    <th className="px-5 py-4 font-medium">Total</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

                {userOrders.length === 0 ? (

                    <tr>
                        <td colSpan="5"
                            className="text-center py-10 text-gray-500">
                            No orders found for this user.
                        </td>
                    </tr>

                ) : (

                    currentOrders.map(function(order) {
                        return (
                            <tr key={order.id}
                                className="hover:bg-gray-50 transition">

                                {/* Order ID and Date */}
                                <td className="px-5 py-4">
                                    <p className="font-medium text-gray-800 text-sm">
                                        #{order.id}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </td>

                                {/* Items */}
                                <td className="px-5 py-4">
                                    {order.items.map(function(item, index) {
                                        return (
                                            <p key={item.id || index}
                                                className="text-sm text-gray-700">
                                                {item.name} (x{item.quantity})
                                            </p>
                                        )
                                    })}
                                </td>

                                {/* Payment */}
                                <td className="px-5 py-4 text-sm text-gray-600">
                                    {order.paymentMethod || "Not available"}
                                </td>

                                {/* Total */}
                                <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                                    ₹{order.total}
                                </td>

                                {/* Status */}
                                <td className="px-5 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        order.status === "Cancelled"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-green-100 text-green-700"
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>

                            </tr>
                        )
                    })

                )}

            </tbody>

        </table>

    </div>
</div>

<div className="flex justify-center items-center gap-4 p-5">

    <button
        onClick={function() {
            if (currentPage > 1) {
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
        disabled={currentPage === totalPage || totalPage === 0}
        className="px-4 py-2 border rounded-lg disabled:opacity-50"
    >
        Next
    </button>

</div>


    </div>
)

}

export default UserDetails