import { NavLink } from 'react-router-dom'

function Sidebar(){
const Link=[
     { name: 'Dashboard', path: '/admin/dashboard' },
     { name: 'Products', path: '/admin/products' },
     { name: 'Users', path: '/admin/users' },
     { name: 'Orders', path: '/admin/orders' }
]


  return (
        <aside className="w-64 min-h-screen bg-gray-900 text-white p-5">

            <h1 className="text-2xl font-bold mb-10">
                iStore Admin
            </h1>

            <nav>
                {Link.map(function(link) {
                    return (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.path === '/admin/dashboard'}
                            className={function({ isActive }) {
                                return `block p-3 mb-2 rounded-lg ${
                                    isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800'
                                }`
                            }}
                        >
                            {link.name}
                        </NavLink>
                    )
                })}
            </nav>

        </aside>
    )
}

export default Sidebar