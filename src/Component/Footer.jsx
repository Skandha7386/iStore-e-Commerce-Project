
import { Link } from 'react-router-dom'

function Footer() {

    return (

        <footer className="w-full bg-[#f5f5f7] text-gray-700">

            <div className="max-w-7xl mx-auto px-8 py-14">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16">

                    {/* iStore */}
                    <div>
                        <Link to="/" className="text-3xl font-bold text-black">
                            iStore
                        </Link>

                        <p className="text-sm text-gray-500 mt-4 leading-6">
                            Your destination for premium accessories.
                            Discover products designed for your everyday life.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-black mb-5">
                            Quick Links
                        </h3>

                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link to="/" className="hover:text-black">Home</Link></li>
                            <li><Link to="/products" className="hover:text-black">Store</Link></li>
                            <li><Link to="/accessories" className="hover:text-black">Accessories</Link></li>
                        </ul>
                    </div>

                    {/* Explore Category */}
                    <div>
                        <h3 className="text-sm font-semibold text-black mb-5">
                            Explore Category
                        </h3>

                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link to="/accessories?device=iPhone" className="hover:text-black">iPhone</Link></li>
                            <li><Link to="/accessories?device=iPad" className="hover:text-black">iPad</Link></li>
                            <li><Link to="/accessories?device=Mac" className="hover:text-black">Mac</Link></li>
                            <li><Link to="/accessories?device=Apple%20Watch" className="hover:text-black">Apple Watch</Link></li>
                            <li><Link to="/accessories?device=AirPods" className="hover:text-black">AirPods</Link></li>
                            <li><Link to="/accessories?device=AirTag" className="hover:text-black">AirTag</Link></li>
                            <li><Link to="/accessories?device=Beats" className="hover:text-black">Beats</Link></li>
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h3 className="text-sm font-semibold text-black mb-5">
                            Customer Care
                        </h3>

                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link to="/faq" className="hover:text-black">FAQ</Link></li>
                            <li><Link to="/shipping" className="hover:text-black">Shipping and Delivery</Link></li>
                            <li><Link to="/returns" className="hover:text-black">Returns</Link></li>
                            <li><Link to="/contact" className="hover:text-black">Contact Us</Link></li>
                        </ul>
                    </div>

                </div>

                {/* Bottom */}
                <div className="border-t border-gray-300 mt-12 pt-6">
                    <p className="text-xs text-gray-500 text-center">
                        Copyright © 2026 iStore. All rights reserved.
                    </p>
                </div>

            </div>

        </footer>
    )
}

export default Footer
