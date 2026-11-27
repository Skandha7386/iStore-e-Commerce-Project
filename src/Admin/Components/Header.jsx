
import { useNavigate } from 'react-router-dom'
import {useState} from 'react'
function Header() {

    const [showLogout,setShowLogout]=useState(false)

    const navigate=useNavigate()


    const admin = JSON.parse(sessionStorage.getItem('admin'))

    
    function handleLogout(){
        sessionStorage.removeItem('admin')
        navigate('/admin/login', { replace: true })
    }

    return (
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">

            <div>
                <h2 className="text-xl font-semibold">
                    Admin Panel
                </h2>

                <p className="text-sm text-gray-500">
                    Welcome, {admin?.username}
                </p>
            </div>

            

          <button
    onClick={function(){
setShowLogout(true)
    }}
    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
>
    Logout
</button>

{showLogout && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

        <div className="bg-white p-6 rounded-xl shadow-lg w-96">

            <h2 className="text-xl font-bold mb-3">
                Confirm Logout
            </h2>

            <p className="text-gray-600 mb-6">
                Are you sure you want to logout from your admin account?
            </p>

            <div className="flex justify-end gap-3">

                <button
                    onClick={function () {
                        setShowLogout(false)
                    }}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                    Cancel
                </button>

                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    Yes, Logout
                </button>

            </div>

        </div>

    </div>
)}
        </header>
    )
}

export default Header
