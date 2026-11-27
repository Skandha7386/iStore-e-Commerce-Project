
import { getAdminOrders, updateAdminOrderStatus } from '../AdminServices/adminOrderservice'
import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { ChevronDown, ListFilter, Search } from 'lucide-react'

function Orders() {

    const [search, setSearch] = useState('')

    const [selectedStatus,setSelectedStatus]=useState("All")

    const [currentPage,setCurrentPage]=useState(1)

    const orderPerPage=5

    const navigate=useNavigate()

    const queryClient=useQueryClient()

    const { data = [], isLoading, isError } = useQuery({
        queryKey: ['adminOrders'],
        queryFn: getAdminOrders
    })

    const statusMutation=useMutation({
        mutationFn:function(orderData){
            return updateAdminOrderStatus(
                orderData.id,
                orderData.status,
                orderData.statusHistory
        )
        },
        onSuccess:function(){
            queryClient.invalidateQueries({
                queryKey:['adminOrders']
            })
        }
    })

    if (isLoading) {
        return <h2>Loading Orders...</h2>
    }

    if (isError) {
        return <h2>Something went Wrong!</h2>
    }

    const filteredOrders = data.filter(function(order) {

        const orderId = order.id.toLowerCase()
        const customerName = order.customer.name.toLowerCase()
        const searchText = search.toLowerCase()

        const matchSearch=orderId.includes(searchText)||
                          customerName.includes(searchText)

        const matchStatus=selectedStatus === "All"||
                          order.status === selectedStatus
                          

        return matchSearch && matchStatus
    })


    const startIndex=(currentPage - 1) * orderPerPage
    const endIndex= startIndex + orderPerPage

    const currentOrders=filteredOrders.slice(startIndex,endIndex)

    const totalOrders=Math.ceil(filteredOrders.length/orderPerPage)

       return (
        <div>

            <h1 className="text-2xl font-bold mb-6">
                Manage Orders
            </h1>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                    <label htmlFor="orders-search" className="mb-2 block text-sm font-medium text-gray-700">
                        Search orders
                    </label>
                    <div className="relative">
                        <Search
                            size={18}
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            id="orders-search"
                            type="text"
                            value={search}
                            placeholder="Order ID or customer name"
                            onChange={function(event) {
                                setSearch(event.target.value)
                                setCurrentPage(1)
                            }}
                            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>
                </div>

                <div className="w-full sm:w-56">
                    <label htmlFor="orders-status-filter" className="mb-2 block text-sm font-medium text-gray-700">
                        Filter by status
                    </label>
                    <div className="relative">
                        <ListFilter
                            size={17}
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <select
                            id="orders-status-filter"
                            value={selectedStatus}
                            onChange={function(event) {
                                setSelectedStatus(event.target.value)
                                setCurrentPage(1)
                            }}
                            className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-10 text-sm font-medium text-gray-700 shadow-sm outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        >
                            <option value="All">All</option>
                            <option value="placed">Placed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <ChevronDown
                            size={17}
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">

                <table className="w-full text-left">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-5 py-4">Order ID</th>
                            <th className="px-5 py-4">Customer</th>
                            <th className="px-5 py-4">Date</th>
                            <th className="px-5 py-4">Items</th>
                            <th className="px-5 py-4">Total</th>
                            <th className="px-5 py-4">Payment</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4">Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {filteredOrders.length === 0 ? (

                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-8 text-gray-500"
                                >
                                    No orders found
                                </td>
                            </tr>

                        ) : (

                        currentOrders.map(function(order) {

                                return (
                                    <tr
                                        key={order.id}
                                        className="border-b hover:bg-gray-50"
                                    >

                                        <td className="px-5 py-4">
                                            #{order.id}
                                        </td>

                                        <td className="px-5 py-4">
                                            {order.customer.name}
                                        </td>

                                        <td className="px-5 py-4">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>

                                        <td className="px-5 py-4">
                                            {order.items.length}
                                        </td>

                                        <td className="px-5 py-4">
                                            ₹{order.total}
                                        </td>

                                        <td className="px-5 py-4">
                                            {order.paymentMethod || "Not Available"}
                                        </td>

                                       <td className="px-5 py-4">
    <select
        value={order.status}
                disabled={
    order.status === "delivered" ||
    order.status === "cancelled"
}
        onChange={function(event) {
         const newStatus=event.target.value

         const previousHistory=order.statusHistory||[
            {
                status:order.status,
                date:order.createdAt
            }
         ]

         const updatedHistory=[
            ...previousHistory,
            {
                status:newStatus,
                date:new Date().toISOString()

            }
         ]

         statusMutation.mutate({
            id:order.id,
            status:newStatus,
            statusHistory:updatedHistory
         })
        }}
        className="border rounded-lg p-2"
    >
        {order.status === "placed" &&(
            <>
            <option value="placed">Placed</option>
            <option value="processing">Processing</option>
            <option value="cancelled">Cancelled</option>
            </>
        )}

        {order.status === "processing" &&(
              <>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="cancelled">Cancelled</option>
              
              </>
        )}

        {order.status === "shipped" &&(
            <>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            </>
        )}

        {order.status === "delivered"&&(
            <option value="delivered">Delivered</option>
        )}

        {order.status === "cancelled"&&(
            <option value="cancelled">Cancelled</option>
        )}


    </select>
</td>

                                        <td className="px-5 py-4">
    <button
        onClick={function() {
            navigate(`/admin/orders/${order.id}`)
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
    >
        View Details
    </button>
</td>

                                    </tr>
                                )
                            })

                        )}

                    </tbody>



                </table>



            </div>
            <div className="flex justify-center items-center gap-4 mt-6">

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
        Page {currentPage} of {totalOrders}
    </span>

    <button
        onClick={function() {
            setCurrentPage(currentPage + 1)
        }}
        disabled={currentPage === totalOrders || totalOrders === 0}
        className="px-4 py-2 border rounded-lg disabled:opacity-50"
    >
        Next
    </button>

</div>

        </div>
    )
}

export default Orders
