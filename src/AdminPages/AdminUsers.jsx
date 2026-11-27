import { getAdminUser, deleteAdminUser, updateAdminUserStatus } from '../AdminServices/adminUserService'
import { getAdminOrders } from '../AdminServices/adminOrderservice'
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query'
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { ChevronDown, ListFilter, Search } from 'lucide-react'

function Users() {



    const [search,setSearch]=useState("")
    const [debounceSearch,setDebounceSearch]=useState("")
    const [selectedStatus,setSelectedStatus]=useState("All")

    const [currentPage,setCurrentPage]=useState(1)

    const userPerPage=5

    useEffect(function(){
        setCurrentPage(1)
    },[search,selectedStatus])

    useEffect(function(){
        const timer=setTimeout(function(){
            setDebounceSearch(search)
        },500)

        return function(){
            clearTimeout(timer)
        }
    },[search])

    

    const navigate=useNavigate()

    const {data=[],isLoading,isError}=useQuery({
        queryKey:['adminUsers'],
        queryFn:getAdminUser
    })

    const {data:orders=[]}=useQuery({
        queryKey:['adminOrders'],
        queryFn:getAdminOrders
    })



    const queryClient=useQueryClient()

    const deleteMutation=useMutation({
        mutationFn:deleteAdminUser,

        onSuccess:function(){
            queryClient.invalidateQueries({
                queryKey:['adminUsers']
            })
        }
    })

    const statusMutation=useMutation({
        mutationFn:function(userData){
            return updateAdminUserStatus(userData.id,userData.status)
        },

        onSuccess:function(){
            queryClient.invalidateQueries({
                queryKey:['adminUsers']
            })
        }
    })

 

    const filteredUser=data.filter(function(user){
        const name=user.name.toLowerCase()
        const username=user.username.toLowerCase()
        const email=user.email.toLowerCase()

        const searchText=debounceSearch.toLowerCase()


        const matchSearch=name.includes(searchText)||
                          username.includes(searchText)||
                          email.includes(searchText)


        const matchStatus=selectedStatus === "All"||
                            (user.status||"Active") === selectedStatus

                            return matchSearch&& matchStatus
    })

    const totalPage=Math.ceil(filteredUser.length/userPerPage)

    const startIndex=(currentPage-1 ) * userPerPage
    const endIndex=startIndex + userPerPage

    const currentUsers=filteredUser.slice(startIndex,endIndex)

    useEffect(function() {
    if (totalPage > 0 && currentPage > totalPage) {
        setCurrentPage(totalPage)
    }
}, [currentPage, totalPage])

   if(isLoading){
        return <h2>Loading Users...</h2>
    }
    if(isError){
        return <h2>Something went Wrong!</h2>
    }

    
    return (
        <div>
            <h1 className="mb-2 text-2xl font-bold">
                Manage Users
            </h1>
            <p className="mb-6 text-sm text-gray-500">
                Total users: <span className="font-semibold text-gray-700">{data.length}</span>
            </p>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                    <label htmlFor="users-search" className="mb-2 block text-sm font-medium text-gray-700">
                        Search users
                    </label>
                    <div className="relative">
                        <Search
                            size={18}
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            id="users-search"
                            type="text"
                            value={search}
                            placeholder="Name, username or email"
                            onChange={function(event) {
                                setSearch(event.target.value)
                            }}
                            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>
                </div>
                

                <div className="w-full sm:w-56">
                    <label htmlFor="users-status-filter" className="mb-2 block text-sm font-medium text-gray-700">
                        Filter by status
                    </label>
                    <div className="relative">
                        <ListFilter
                            size={17}
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <select
                            id="users-status-filter"
                            value={selectedStatus}
                            onChange={function(event) {
                                setSelectedStatus(event.target.value)
                            }}
                            className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-10 text-sm font-medium text-gray-700 shadow-sm outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        >
                            <option value="All">All users</option>
                            <option value="Active">Active users</option>
                            <option value="Blocked">Blocked users</option>
                        </select>
                        <ChevronDown
                            size={17}
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    </div>
                </div>
            </div>

       <table className="w-full bg-white rounded-xl shadow-sm overflow-hidden">

    <thead className="bg-gray-100">
        <tr className="text-left text-gray-600">
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Phone</th>
            <th className="px-6 py-4">Orders</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Action</th>
        </tr>
    </thead>

  
<tbody>
    {filteredUser.length === 0 ? (
        <tr>
            <td colSpan="5" className="text-center py-8 text-gray-500">
                {selectedStatus === "Blocked"
                    ? "No blocked users found"
                    : selectedStatus === "Active"
                    ? "No active users found"
                    : "No users found"}
            </td>
        </tr>
    ) : (
        currentUsers.map(function(user) {

            const userOrder = orders.filter(function(order) {
                return order.userId === user.id
            })

            const orderCount = userOrder.length

            const phoneNumber = userOrder.length > 0
                ? userOrder[0].customer.phone
                : "Not Available"

            return (
                <tr key={user.id} className="border-b hover:bg-gray-50">

                    <td className="px-6 py-4">
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </td>

                    <td className="px-6 py-4">{phoneNumber}</td>

                    <td className="px-6 py-4">{orderCount}</td>

                    <td className="px-6 py-4">
                        {user.status || "Active"}
                    </td>

                    <td className="px-6 py-4">

                        <button
                            onClick={function() {
                                navigate(`/admin/users/${user.id}`)
                            }}
                            className="mr-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                            View Details
                        </button>

                        <button
                            onClick={function() {
                                const confirmDelete = window.confirm(
                                    "Are you sure you want to delete this user?"
                                )

                                if (confirmDelete) {
                                    deleteMutation.mutate(user.id)
                                }
                            }}
                            className="mr-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                        >
                            Delete
                        </button>

                        <button
                            onClick={function() {
                                const newStatus = user.status === "Blocked"
                                    ? "Active"
                                    : "Blocked"

                                statusMutation.mutate({
                                    id: user.id,
                                    status: newStatus
                                })
                            }}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                user.status === "Blocked"
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                            }`}
                        >
                            {user.status === "Blocked" ? "Unblock" : "Block"}
                        </button>

                    </td>
                </tr>
            )
        })
    )}
</tbody>
</table>
        </div>
    )
}

export default Users