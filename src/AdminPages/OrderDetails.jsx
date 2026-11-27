import { getAdminOrderById } from '../AdminServices/adminOrderservice'
import {useQuery} from '@tanstack/react-query'
import {useParams,useNavigate} from 'react-router-dom'

function OrderDetails(){

    const {id}=useParams()
    const navigate =useNavigate()

    const {data,isLoading,isError}=useQuery({
        queryKey:['adminOrder',id],
        queryFn:function(){
            return getAdminOrderById(id)
        }
    })

    if(isLoading){
        return <h2>Loading Order Details...</h2>
    }

    if(isError){
         return <h2>Something went Wrong!</h2>
    }


    return(
        <div>

    <h1 className="text-2xl font-bold mb-6">

        Order Details
        
    </h1>

       <button onClick={function(){
        navigate('/admin/orders')
       }}
        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg mb-5"
       >← Back to Orders</button>


<div className="bg-white p-6 rounded-xl shadow-sm mb-6">

    <h2 className="text-lg font-semibold mb-4">
        Customer Information
    </h2>

    <p className="mb-3">
        <strong>Name:</strong> {data.customer.name}
    </p>

    <p className="mb-3">
        <strong>Email:</strong> {data.customer.email}
    </p>

    <p className="mb-3">
        <strong>Phone:</strong> {data.customer.phone}
    </p>

    <p>
        <strong>Address:</strong> {data.customer.address}
    </p>

</div>



<div className="bg-white p-6 rounded-xl shadow-sm mb-6">

    <h2 className="text-lg font-semibold mb-4">
        Ordered Products
    </h2>

 

    <div className="overflow-x-auto">

        <table className="w-full text-left">

            <thead className="bg-gray-100">
                <tr>
                    <th className="px-5 py-3">Product Name</th>
                    <th className="px-5 py-3">Quantity</th>
                    <th className="px-5 py-3">Price</th>
                    <th className="px-5 py-3">Subtotal</th>
                </tr>
            </thead>

            <tbody>

                {data.items.map(function(item) {

                    return (
                        <tr key={item.productId} className="border-b">

                            <td className="px-5 py-4">
                                {item.name}
                            </td>

                            <td className="px-5 py-4">
                                {item.quantity}
                            </td>

                            <td className="px-5 py-4">
                                ₹{item.price}
                            </td>

                            <td className="px-5 py-4">
                                ₹{item.price * item.quantity}
                            </td>

                        </tr>
                    )

                })}

            </tbody>

        </table>

    </div>

</div>


<div className="bg-white p-6 rounded-xl shadow-sm mb-6">

    <h2 className="text-lg font-semibold mb-4">
        Order Summary
    </h2>

    <p className="mb-3">
        <strong>Order Date:</strong>{" "}
        {new Date(data.createdAt).toLocaleString()}
    </p>

    <p className="mb-3">
        <strong>Payment Method:</strong>{" "}
        {data.paymentMethod || "Not Available"}
    </p>

    <p className="mb-3">
        <strong>Total Amount:</strong> ₹{data.total}
    </p>

    <p>
        <strong>Order Status:</strong>{" "}
        {data.status}
    </p>

</div>


<div className="bg-white p-6 rounded-xl shadow-sm mb-6">
    <h2 className="text-lg font-semibold mb-5">
        Order Tracking History
    </h2>

    <div className="space-y-4">
        {data.statusHistory?.map(function(item, index) {
            return (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold capitalize">
                        {item.status}
                    </p>

                    <p className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleString()}
                    </p>
                </div>
            )
        })}
    </div>
</div>





        </div>
    )




}
export default OrderDetails