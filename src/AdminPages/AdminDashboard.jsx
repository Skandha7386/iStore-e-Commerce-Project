import { getAdminProducts } from '../AdminServices/adminProductService'
import { getAdminUser } from '../AdminServices/adminUserService'
import { getAdminOrders } from '../AdminServices/adminOrderservice'
import {useQuery} from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

function Dashboard() {

    const navigate =useNavigate()
    const {data:product=[],isLoading:productsLoading,isError:productsError}=useQuery({
        queryKey: ['adminProduct_fetch'],
        queryFn:getAdminProducts
    })

    const {data:orders=[],isLoading:orderLoading,isError:orderErrror}=useQuery({
        queryKey: ['adminOrders'],
        queryFn:getAdminOrders

    })

    const {data:users=[],isLoading:userLoading,isError:userError}=useQuery({
        queryKey:['adminUsers'],
        queryFn:getAdminUser
    })

    const totalProducts=product.length
    const totalOrders=orders.length
    const totalUsers=users.length


    const totalRevenue=orders.reduce(function(total,order){
            if(order.status !== "cancelled"){
                return total + order.total
            }
            return total
    },0)

    const recentOrders=[...orders]
            .sort(function(a,b){
                return new Date(b.createdAt)-new Date(a.createdAt)
            })  
            .slice(0,5)    


    const lowStockProduct=product.filter(function(item){
        return item.stock <= 10
    })


    const placedOrders=orders.filter(function(order){
        return order.status === "placed"
    }).length

    const processingOrder=orders.filter(function(order){
        return order.status === "processing"
    }).length

    const shippedOrder=orders.filter(function(order){
        return order.status === "shipped"
    }).length

    const deleveredOrder=orders.filter(function(order){
        return order.status === "delivered"
    }).length
    
    const cancelledOrder=orders.filter(function(order){
          return order.status === "cancelled"
    }).length


    if (productsLoading || orderLoading || userLoading) {
    return <p className="p-6">Loading dashboard...</p>
}

if (productsError || orderErrror || userError) {
    return <p className="p-6 text-red-600">Failed to load dashboard data.</p>
}
    return (
       
        <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard
    </h1>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-gray-500">Total Products</h2>
            <p className="text-3xl font-bold mt-2">{totalProducts}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-gray-500">Total Orders</h2>
            <p className="text-3xl font-bold mt-2">{totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-gray-500">Total Customers</h2>
            <p className="text-3xl font-bold mt-2">{totalUsers}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-gray-500">Total Revenue</h2>
            <p className="text-3xl font-bold mt-2">
                ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
        </div>

    </div>

    <div className="bg-white rounded-xl shadow mt-8 p-6">
    <h2 className="text-xl font-bold mb-5">
        Order Status Overview
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        <div className="bg-blue-50 p-5 rounded-lg">
            <h3 className="text-gray-600">Placed</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">
                {placedOrders}
            </p>
        </div>

        <div className="bg-yellow-50 p-5 rounded-lg">
            <h3 className="text-gray-600">Processing</h3>
            <p className="text-2xl font-bold text-yellow-600 mt-2">
                {processingOrder}
            </p>
        </div>

        <div className="bg-purple-50 p-5 rounded-lg">
            <h3 className="text-gray-600">Shipped</h3>
            <p className="text-2xl font-bold text-purple-600 mt-2">
                {shippedOrder}
            </p>
        </div>

        <div className="bg-green-50 p-5 rounded-lg">
            <h3 className="text-gray-600">Delivered</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">
                {deleveredOrder}
            </p>
        </div>

        <div className="bg-red-50 p-5 rounded-lg">
            <h3 className="text-gray-600">Cancelled</h3>
            <p className="text-2xl font-bold text-red-600 mt-2">
                {cancelledOrder}
            </p>
        </div>

    </div>
</div>

 <div className="bg-white rounded-xl shadow mt-8 p-6">
    <h2 className="text-xl font-bold mb-5">
        Recent Orders
    </h2>

    <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead>
                <tr className="border-b text-gray-500">
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                </tr>
            </thead>

            <tbody>
                {recentOrders.map(function(order) {
                    return (
                        <tr key={order.id} className="border-b">
                            <td className="p-3">{order.id}</td>
                            <td className="p-3">{order.customer.name}</td>
                            <td className="p-3">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                                ₹{order.total.toLocaleString('en-IN')}
                            </td>
                            <td className="p-3 capitalize">
                                {order.status}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        <div className="flex justify-end mt-5">
    <button
        onClick={function() {
            navigate('/admin/orders')
        }}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
    >
        View All Orders
    </button>
</div>
    </div>
</div>


<div className="bg-white rounded-xl shadow mt-8 p-6">
    <h2 className="text-xl font-bold mb-5">
        Low Stock Products
    </h2>

    <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead>
                <tr className="border-b text-gray-500">
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Available Stock</th>
                </tr>
            </thead>

            <tbody>
                {lowStockProduct.length === 0 ? (
                    <tr>
                        <td colSpan="4" className="p-4 text-center text-gray-500">
                            No low stock products found.
                        </td>
                    </tr>
                ) : (
                    lowStockProduct.map(function(item) {
                        return (
                            <tr key={item.id} className="border-b">
                                <td className="p-3">{item.name}</td>
                                <td className="p-3">{item.category}</td>
                                <td className="p-3">
                                   ₹{Number(item.price || 0).toLocaleString('en-IN')}
                                </td>
                                <td className="p-3 text-red-600 font-semibold">
                                    {item.stock}
                                </td>
                            </tr>
                        )
                    })
                )}
            </tbody>
        </table>

        

        
    </div>
</div>






</div>

        
    )
}

export default Dashboard