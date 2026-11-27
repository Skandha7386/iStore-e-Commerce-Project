import { Navigate, Outlet } from 'react-router-dom'

function AdminProtectedRoute() {

    const admin = sessionStorage.getItem('admin')

    if (!admin) {
        return <Navigate to="/admin/login" replace />
    }

    return <Outlet />
}

export default AdminProtectedRoute