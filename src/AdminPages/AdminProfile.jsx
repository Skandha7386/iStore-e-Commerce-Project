function AdminProfile() {
    const admin = JSON.parse(sessionStorage.getItem('admin'))

    
     return (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Profile</h1>

        <div className="bg-white shadow rounded-lg p-6 max-w-md">

            <div className="mb-4">
                <h2 className="text-lg font-semibold">Account Information</h2>
            </div>

            <p className="text-gray-600 mb-3">
                Username: {admin.username}
            </p>

            <p className="text-gray-600">
                Admin ID: {admin.id}
            </p>

        </div>
    </div>
)
    
}

export default AdminProfile
